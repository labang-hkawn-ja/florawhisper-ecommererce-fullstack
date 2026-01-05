package org.example.florawhisperbackend.dao;

import org.example.florawhisperbackend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminDao extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUsername(String username);
}
