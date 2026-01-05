package org.example.florawhisperbackend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.florawhisperbackend.entity.Color;

import java.util.Base64;

@Getter @Setter
@NoArgsConstructor
public class PlantDto {
    private long plantId;
    private String name;
    private String description;
    private double price;
    private int stock;
    private String imageUrl;
    private double updatePrice;

    private String plantSize;
    private Boolean isEasyToCare;
    private String careInstructions;
    private String category;

    private Color color;
    private int piece;

    public PlantDto(long plantId, String name, String description, double price, int stock, byte[] imageUrl, double updatePrice, String plantSize, Boolean isEasyToCare, String careInstructions, String category, Color color, int piece) {
        this.plantId = plantId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl != null ? Base64.getEncoder().encodeToString(imageUrl) : null ;
        this.updatePrice = updatePrice;
        this.plantSize = plantSize;
        this.isEasyToCare = isEasyToCare;
        this.careInstructions = careInstructions;
        this.category = category;
        this.color = color;
        this.piece = piece;
    }
}
