package org.example.florawhisperbackend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class CheckoutPlantItemDto {

    private Long id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private String categoryName;
    private String plantType;
    private String color;
    private Integer piece;
    private String plantSize;
    private Boolean easyToCare;
    private String careInstructions;
}
