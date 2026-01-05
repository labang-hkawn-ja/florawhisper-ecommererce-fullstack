package org.example.florawhisperbackend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.florawhisperbackend.entity.Color;
import org.springframework.web.multipart.MultipartFile;

@Getter @Setter
@NoArgsConstructor
public class PlantCreateDto {
    private String name;
    private String description;
    private double price;
    private int stock;
    private double updatePrice;
    private MultipartFile imageUrl;
    private String category;

    // Flower-specific
    private Color color;
    private int piece;

    // IndoorPlant-specific
    private String plantSize;
    private Boolean isEasyToCare;
    private String careInstructions;
}
