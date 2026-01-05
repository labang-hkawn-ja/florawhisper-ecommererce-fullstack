package org.example.florawhisperbackend.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) throws Exception {
        http.sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(c -> {
            c.requestMatchers("/api/flora/categories", "api/flora/categories/**",
                    "api/flora/plants", "api/flora/plants/**").permitAll();
            c.requestMatchers("/api/auth/**").permitAll();
            c.requestMatchers("/api/flora/flower-meanings").permitAll();
            c.requestMatchers("/api/user/**").authenticated();
            c.anyRequest().authenticated();
        });

        http.exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(jwtAuthenticationEntryPoint) // Add this
        );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.csrf(c -> c.disable());

        http.cors(c ->{
                    CorsConfigurationSource source=
                            new CorsConfigurationSource() {

                                @Override
                                public CorsConfiguration
                                getCorsConfiguration(HttpServletRequest request) {
                                    CorsConfiguration config=
                                            new CorsConfiguration();
                                    config.setAllowedOrigins(List.of("http://localhost:5173"));
                                    config.setAllowedMethods(List.of("*"));
                                    config.setAllowedHeaders(List.of("*"));
                                    config.addExposedHeader("*");
                                    config.setAllowCredentials(true);
                                    return config;
                                }
                            };
                    c.configurationSource(source);
                }
        );
        return http.build();
    }
}
