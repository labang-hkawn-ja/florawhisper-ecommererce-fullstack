package org.example.florawhisperbackend.dao;

import org.example.florawhisperbackend.entity.Color;
import org.example.florawhisperbackend.entity.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlantDao extends JpaRepository<Plant, Long>{

    List<Plant> findByCategoryId(long categoryId);

    @Query("SELECT p FROM Plant p WHERE p.category.categoryName = :categoryName AND p.name = :name")
    Optional<Plant> findByCategoryNameAndName(String categoryName, String name);

    // Search Flowers by color (category ID = 1)
    @Query("SELECT f FROM Plant p JOIN Flower f ON p.id = f.id WHERE TYPE(p) = Flower AND p.category.id = 1 AND f.color = :color")
    List<Plant> findFlowersByColor(@Param("color") Color color);

    // Search Flowers by name (category ID = 1)
    @Query("SELECT f FROM Plant p JOIN Flower f ON p.id = f.id WHERE TYPE(p) = Flower AND p.category.id = 1 AND LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Plant> findFlowersByNameContaining(@Param("name") String name);

    // Search Flowers by color and name (category ID = 1)
    @Query("SELECT f FROM Plant p JOIN Flower f ON p.id = f.id WHERE TYPE(p) = Flower AND p.category.id = 1 AND f.color = :color AND LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Plant> findFlowersByColorAndNameContaining(@Param("color") Color color, @Param("name") String name);

    // Search Indoor Plants by name (category ID = 2)
    @Query("SELECT p FROM Plant p WHERE TYPE(p) = IndoorPlant AND p.category.id = 2 AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Plant> findIndoorPlantsByNameContaining(@Param("name") String name);
}
