package org.example.florawhisperbackend.dao;

import org.example.florawhisperbackend.entity.IndoorPlant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IndoorPlantDao extends JpaRepository<IndoorPlant, Long> {

}
