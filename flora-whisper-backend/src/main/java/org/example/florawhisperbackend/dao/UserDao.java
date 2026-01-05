package org.example.florawhisperbackend.dao;

import org.example.florawhisperbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserDao extends JpaRepository<User, Long> {

    @Query("""
    SELECT u
    FROM User u
    WHERE u.username = ?1
    OR u.email = ?1
""")
    Optional<User> findByUsernameOrEmail(String usernameOrEmail);
}
