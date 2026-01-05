package org.example.florawhisperbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlowerMeaning extends IdClass {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 150)
    private String scientificName;

    @Column(nullable = false, length = 200)
    private String meaning;

    @Column(columnDefinition = "TEXT")
    private String symbolism;

    @Lob
    private String description;

    @Column(columnDefinition = "TEXT")
    private String plantingGuide;

    @Column(columnDefinition = "TEXT")
    private String careInstructions;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Season season;

    @ElementCollection
    @CollectionTable(
            name = "flower_occasions",
            joinColumns = @JoinColumn(name = "flower_id")
    )
    @Column(name = "occasion", length = 50)
    private List<String> occasions = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "flower_cultural_meanings",
            joinColumns = @JoinColumn(name = "flower_id")
    )
    @Column(name = "cultural_meaning", columnDefinition = "TEXT")
    private List<String> culturalMeanings = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "flower_images",
            joinColumns = @JoinColumn(name = "flower_id")
    )
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @Column(length = 50)
    private String bloomingPeriod;

    @Column(length = 100)
    private String colorVarieties;

    @ElementCollection
    @CollectionTable(
            name = "flower_color_meanings",
            joinColumns = @JoinColumn(name = "flower_id")
    )
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "color")
    @Column(name = "color_meaning", columnDefinition = "TEXT")
    private Map<Color, String> colorMeanings = new HashMap<>();

    @Column(length = 50)
    private String originCountry;

    private Boolean isPerennial;

    public void addImageUrl(String imageUrl) {
        if (this.imageUrls == null) {
            this.imageUrls = new ArrayList<>();
        }
        this.imageUrls.add(imageUrl);
    }

    public void addOccasion(String occasion) {
        if (this.occasions == null) {
            this.occasions = new ArrayList<>();
        }
        this.occasions.add(occasion);
    }

    public void addCulturalMeaning(String culturalMeaning) {
        if (this.culturalMeanings == null) {
            this.culturalMeanings = new ArrayList<>();
        }
        this.culturalMeanings.add(culturalMeaning);
    }
}


