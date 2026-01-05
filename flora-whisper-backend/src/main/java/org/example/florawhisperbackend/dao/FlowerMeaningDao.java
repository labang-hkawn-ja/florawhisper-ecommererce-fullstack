package org.example.florawhisperbackend.dao;

import org.example.florawhisperbackend.entity.FlowerMeaning;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FlowerMeaningDao extends JpaRepository<FlowerMeaning, Long> {

    Optional<FlowerMeaning> findByName(String name);
}
