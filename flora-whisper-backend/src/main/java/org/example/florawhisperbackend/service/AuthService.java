package org.example.florawhisperbackend.service;

import lombok.RequiredArgsConstructor;
import org.example.florawhisperbackend.dao.*;
import org.example.florawhisperbackend.dto.ChangePasswordRequest;
import org.example.florawhisperbackend.dto.FloraDto.*;
import org.example.florawhisperbackend.dto.LoginResponse;
import org.example.florawhisperbackend.dto.UserProfileDto;
import org.example.florawhisperbackend.entity.*;
import org.example.florawhisperbackend.exception.NotFoundException;
import org.example.florawhisperbackend.exception.RegisterAccountTypeError;
import org.example.florawhisperbackend.exception.AlreadyExistException;
import org.example.florawhisperbackend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final CustomerDao customerDao;
    private final AdminDao adminDao;
    private final RoleDao roleDao;
    private final AuthenticationManager authenticationManager;
    private final UserDao userDao;
    private final PaymentAccountDao paymentAccountDao;
    private final OtpDao otpDao;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(LoginRequest loginRequest) {
        var auth = new UsernamePasswordAuthenticationToken(loginRequest.userNameOrEmail(), loginRequest.password());
        Authentication authentication = authenticationManager.authenticate(auth);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get the actual username from authentication
        String username = authentication.getName();
        String roleName = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_CUSTOMER");

        String token = jwtTokenProvider.generateToken(authentication);

        boolean isBankUser = roleName.equalsIgnoreCase("ROLE_BANKUSER");
        if(isBankUser) {
            User user = userDao.findByUsernameOrEmail(loginRequest.userNameOrEmail())
                    .orElseThrow(() -> new NotFoundException("User not found"));
            PaymentAccount accname = (PaymentAccount) user;
            String otp = renewOtp(user.getId(), user.getUsername());
            return new LoginResponse(otp, accname.getAccountNumber(), accname.getUsername());
        }

        return new LoginResponse(token, username, roleName);
    }

    @Transactional
    public String register(RegisterDto registerDto, String accountType) {

        if("customer".equalsIgnoreCase(accountType)) {

            checkUserAlreadyExist(registerDto);

            Role role = getRole("ROLE_CUSTOMER");
            if(role == null) {
                role = new Role();
                role.setRoleName("ROLE_CUSTOMER");
            }

            var customer = new Customer(
                    registerDto.username(),
                    passwordEncoder.encode(registerDto.password()),
                    registerDto.email(),
                    registerDto.firstName(),
                    registerDto.lastName(),
                    registerDto.phone(),
                    LocalDate.now()
            );

            if (registerDto.img() == null && registerDto.img().isEmpty()) {
                throw new RuntimeException("Image is null");
            } else if(registerDto.img() != null && !registerDto.img().isEmpty()) {
                try {
                    customer.setImg(registerDto.img().getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process image");
                }
            }

            customer.addRole(role);
            customerDao.save(customer);

            return "Customer successfully registered.";
        }
        else if("admin".equalsIgnoreCase(accountType)) {

            checkUserAlreadyExist(registerDto);

            Role role = getRole("ROLE_ADMIN");
            if(role == null) {
                role = new Role();
                role.setRoleName("ROLE_ADMIN");
            }

            var admin = new Admin(
                    registerDto.username(),
                    passwordEncoder.encode(registerDto.password()),
                    registerDto.email(),
                    registerDto.firstName(),
                    registerDto.lastName(),
                    registerDto.phone(),
                    LocalDate.now()
            );

            if(registerDto.img() != null && !registerDto.img().isEmpty()) {
                try {
                    admin.setImg(registerDto.img().getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process image");
                }
            }

            admin.addRole(role);
            adminDao.save(admin);

            return "Admin successfully registered.";
        }
        else if ("bankuser".equalsIgnoreCase(accountType)) {

            checkUserAlreadyExist(registerDto);

            Role role = getRole("ROLE_BANKUSER");
            if(role == null) {
                role = new Role();
                role.setRoleName("ROLE_BANKUSER");
            }

            var payment = new PaymentAccount(
                    registerDto.username(),
                    passwordEncoder.encode(registerDto.password()),
                    registerDto.email(),
                    registerDto.firstName(),
                    registerDto.lastName(),
                    registerDto.phone(),
                    LocalDate.now(),
                    generateAccountNumber(registerDto.username()),
                    registerDto.amount() != null ? registerDto.amount() : BigDecimal.valueOf(0)
            );

            if(registerDto.img() != null && !registerDto.img().isEmpty()) {
                try {
                    payment.setImg(registerDto.img().getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process image");
                }
            }

            payment.addRole(role);
            paymentAccountDao.save(payment);

            return "Bank User successfully registered.";
        }
        else {
            throw new RegisterAccountTypeError(accountType + " :: is Wrong account type");
        }
    }

    private void checkUserAlreadyExist(RegisterDto registerDto) {
        if (userDao.findByUsernameOrEmail(registerDto.username()).isPresent() || userDao.findByUsernameOrEmail(registerDto.email()).isPresent()) {
            throw new AlreadyExistException("Username or Email already exists");
        }
    }


    public UserProfileDto getUserProfileByUsername(String username) {
        User user = userDao.findByUsernameOrEmail(username)
                .orElseThrow(() -> new NotFoundException("User not found with username: " + username));
        return toUserProfileDto(user);
    }

    private UserProfileDto toUserProfileDto(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setCreatedAt(user.getCreatedAt());

        // Convert byte[] image to Base64 string
        if (user.getImg() != null && user.getImg().length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(user.getImg());
            dto.setImg(base64Image);
        }

        return dto;
    }

    @Transactional
    public String updateUser(Long id, RegisterDto registerDto) {
        User existingUser = userDao.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));

        updateCommonFields(existingUser, registerDto);

        if (existingUser instanceof PaymentAccount paymentAccount) {
            updateBankFields(paymentAccount, registerDto);
            userDao.save(paymentAccount);
            return "Bank User updated successfully.";
        }

        userDao.save(existingUser);
        return "User updated successfully";
    }

    private void updateCommonFields(User existingUser, RegisterDto registerDto) {
        if (registerDto.username() != null && !registerDto.username().isBlank()) {
            if (!registerDto.username().equals(existingUser.getUsername()) &&
                    userDao.findByUsernameOrEmail(registerDto.username()).isPresent()) {
                throw new AlreadyExistException("%s Username already exists".formatted(registerDto.username()));
            }
            existingUser.setUsername(registerDto.username());
        }

        if (registerDto.email() != null && !registerDto.email().isBlank()) {
            if (!registerDto.email().equals(existingUser.getEmail()) &&
                    userDao.findByUsernameOrEmail(registerDto.email()).isPresent()) {
                throw new RuntimeException("%s Email already exists".formatted(registerDto.email()));
            }
            existingUser.setEmail(registerDto.email());
        }

        if (registerDto.password() != null && !registerDto.password().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(registerDto.password()));
        }

        if (registerDto.phone() != null) {
            existingUser.setPhone(registerDto.phone());
        }

        if (registerDto.firstName() != null) {
            existingUser.setFirstName(registerDto.firstName());
        }

        if (registerDto.lastName() != null) {
            existingUser.setLastName(registerDto.lastName());
        }

        if (registerDto.img() != null && !registerDto.img().isEmpty()) {
            try {
                existingUser.setImg(registerDto.img().getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to process image");
            }
        }
    }

    private void updateBankFields(PaymentAccount paymentAccount, RegisterDto registerDto) {
        if (registerDto.username() != null) {
            paymentAccount.setAccountNumber(generateAccountNumber(registerDto.username()));
        }

        if (registerDto.amount() != null) {
            paymentAccount.setAmount(registerDto.amount());
        }
    }


    private Role getRole(String roleName) {
        return roleDao.findByRoleName(roleName)
                .orElse(null);
    }

    private String generateAccountNumber(String name) {
        StringBuilder names = new StringBuilder();
        for (char c : name.toCharArray()) {
            if (!Character.isSpace(c)) {
                names.append(Character.toUpperCase(c));
            }
        }
        SecureRandom random = new SecureRandom();
        long num = (random.nextInt(100000) + 100000);
        // 1 - 99999
        return new StringBuilder()
                .append("Z")
                .append(names.toString())
                .append(num)
                .toString();
    }

    @Transactional
    public String changePassword(Long id, ChangePasswordRequest request) {

        User currentUser = userDao.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));

        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            throw new RuntimeException("New password cannot be empty");
        }

        if (request.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters long");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userDao.save(currentUser);

        return "Password changed successfully";
    }

    // OTP

    private String renewOtp(Long userId, String username) {
        String code = generateOtp();

        otpDao.findByUserId(userId)
                .ifPresentOrElse(otp -> {
                    otp.setUsername(username);
                    otp.setCode(code);
                    otpDao.saveAndFlush(otp);
                    System.out.println("Updated OTP for user ID: " + userId + ", new username: " + username);
                }, () -> {
                    Otp otp = new Otp();
                    otp.setUserId(userId);
                    otp.setUsername(username);
                    otp.setCode(code);
                    otpDao.save(otp);
                    System.out.println("Created new OTP for user ID: " + userId + ", username: " + username);
                });
        return code;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int code = random.nextInt(1000) + 1000;
        return new StringBuilder().append(code).toString();
    }

}
