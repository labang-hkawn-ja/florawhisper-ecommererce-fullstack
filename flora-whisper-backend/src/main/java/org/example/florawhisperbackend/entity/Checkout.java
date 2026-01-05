package org.example.florawhisperbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Checkout extends IdClass {
    private LocalDate orderDate;
    private double totalAmount;
    private String orderCode;
    private int totalItems;
    private String status;
    private String shippingAddress;
    private String customerNotes;
    private LocalDate expectedDeliveryDate;

    @Enumerated(EnumType.STRING)
    private ShippingStatus shippingStatus;

    @ManyToOne
    private Customer customer;

    @ManyToMany
    @JoinTable(
            name = "checkout_plants",
            joinColumns = @JoinColumn(name = "checkout_id"),
            inverseJoinColumns = @JoinColumn(name = "plant_id")
    )
    private List<Plant> plants = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "checkout_plant_quantities",
            joinColumns = @JoinColumn(name = "checkout_id"))
    @MapKeyColumn(name = "plant_id")
    @Column(name = "quantity")
    private Map<Long, Integer> plantQuantities = new HashMap<>();

    // Simple helper method just for this entity
    public void addPlantQuantity(Long plantId, int quantity) {
        this.plantQuantities.put(plantId, quantity);
        this.totalItems += quantity;
    }

    public void removePlantQuantity(Long plantId) {
        Integer quantity = this.plantQuantities.remove(plantId);
        if (quantity != null) {
            this.totalItems -= quantity;
        }
    }
}

