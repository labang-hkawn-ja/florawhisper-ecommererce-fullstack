package org.example.florawhisperbackend.dao;

import java.util.Optional;

import org.example.florawhisperbackend.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OtpDao extends JpaRepository<Otp, Long> {

	Optional<Otp> findByCodeAndUsername(String code, String username);
	Optional<Otp> findByUserId(Long userId);
}
