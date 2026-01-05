package org.example.florawhisperbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.florawhisperbackend.dto.ChangePasswordRequest;
import org.example.florawhisperbackend.dto.FloraDto.*;
import org.example.florawhisperbackend.dto.LoginResponse;
import org.example.florawhisperbackend.dto.UserProfileDto;
import org.example.florawhisperbackend.entity.User;
import org.example.florawhisperbackend.exception.NotFoundException;
import org.example.florawhisperbackend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/auth/register/{type}")
    public ResponseEntity<String> register(
            @ModelAttribute RegisterDto registerDto,
             @PathVariable("type")String accountType){
        String responseString= authService.register(registerDto, accountType);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseString);
    }

    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(Authentication authentication) {
        String username = authentication.getName();
        UserProfileDto userProfile = authService.getUserProfileByUsername(username);
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping(value = "/user/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @ModelAttribute RegisterDto registerDto) {
        System.out.println("Update Id:" + id);
        System.out.println("RegisterDto Data:" + registerDto.lastName());
        String result = authService.updateUser(id, registerDto);
        return ResponseEntity.ok(Map.of("message", result));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            LoginResponse loginResponse = authService.login(req);
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            System.out.println("Login failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @PutMapping("/auth/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {
        try {
            String result = authService.changePassword(id, request);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to change password"));
        }
    }
}
