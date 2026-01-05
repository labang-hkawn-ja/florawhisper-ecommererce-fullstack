package org.example.florawhisperbackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@DiscriminatorValue("INDOOR_PLANT")
public class IndoorPlant extends Plant{
    private String plantSize;
    private Boolean isEasyToCare;
	@Column(columnDefinition = "TEXT")
    private String careInstructions;
	
	public IndoorPlant(String name, String description, double price, int stock, byte[] imageUrl, double updatePrice,
			String plantSize, Boolean isEasyToCare, String careInstructions) {
		super(name, description, price, stock, imageUrl, updatePrice);
		this.plantSize = plantSize;
		this.isEasyToCare = isEasyToCare;
		this.careInstructions = careInstructions;
	}
	
    
}
