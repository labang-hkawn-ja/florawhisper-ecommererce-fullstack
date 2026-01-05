package org.example.florawhisperbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "plant_type")
public class Plant extends IdClass {

    private String name;
    @Column(columnDefinition = "text")
    private String description;
    private double price;
    private int stock;
    @Lob
    private byte[] imageUrl;
    private double updatePrice;
    
    @ManyToOne
    private Category category;

    @ManyToMany(mappedBy = "plants")
    private List<Checkout> checkouts = new ArrayList<>();

    public Plant(String name, String description, double price, int stock, byte[] imageUrl, double updatePrice) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.updatePrice = updatePrice;
    }
}
