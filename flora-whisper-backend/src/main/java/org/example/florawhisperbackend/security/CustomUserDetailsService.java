package org.example.florawhisperbackend.security;

import lombok.RequiredArgsConstructor;
import org.example.florawhisperbackend.dao.UserDao;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userDao.findByUsernameOrEmail(username).map(SecurityUser::new).orElseThrow(() -> new UsernameNotFoundException("User %s not found".formatted(username)));
    }
}
