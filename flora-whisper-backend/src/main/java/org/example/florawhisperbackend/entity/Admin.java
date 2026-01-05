package org.example.florawhisperbackend.entity;

import java.time.LocalDate;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@DiscriminatorValue("ADMIN")
public class Admin extends User{

	public Admin(String username, String password, String email, String firstName,
			String lastName, String phone, LocalDate createdAt) {

		super(username, password, email, firstName, lastName, phone, createdAt);
	}
	
}
