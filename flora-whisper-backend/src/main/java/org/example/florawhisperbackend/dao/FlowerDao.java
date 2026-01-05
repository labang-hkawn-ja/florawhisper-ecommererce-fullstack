package org.example.florawhisperbackend.dao;

import org.example.florawhisperbackend.entity.Flower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FlowerDao extends JpaRepository<Flower, Long> {

}
