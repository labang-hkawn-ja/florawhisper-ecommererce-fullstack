package org.example.florawhisperbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@DiscriminatorValue("FLOWER")
public class Flower extends Plant {

    @Enumerated(EnumType.STRING)
    private Color color;
    private int piece;
    
	public Flower(String name, String description, double price, int stock, byte[] imageUrl, double updatePrice,
			Color color, int piece) {
		super(name, description, price, stock, imageUrl, updatePrice);
		this.color = color;
		this.piece = piece;
	} 
    
}
