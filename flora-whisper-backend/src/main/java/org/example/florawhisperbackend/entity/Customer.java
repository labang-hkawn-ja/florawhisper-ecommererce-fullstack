package org.example.florawhisperbackend.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@DiscriminatorValue("CUSTOMER")
@NoArgsConstructor
public class Customer extends User{

	@OneToMany(mappedBy = "customer", cascade = CascadeType.PERSIST)
	private List<Checkout> checkouts = new ArrayList<>();

	public Customer(String username, String password, String email, String firstName,
	String lastName, String phone, LocalDate createdAt) {

		super(username, password, email, firstName, lastName, phone, createdAt);
	}
    
	
}
