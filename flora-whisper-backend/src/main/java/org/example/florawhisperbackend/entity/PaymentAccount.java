package org.example.florawhisperbackend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@DiscriminatorValue("ROLE_BANKUSER")
public class PaymentAccount extends User {

	@Column(unique = true)
	private String accountNumber;
	private BigDecimal amount;
	
	public PaymentAccount(String username, String password, String email, String firstName,
						  String lastName, String phone, LocalDate createdAt, String accountNumber, BigDecimal amount) {

		super(username, password, email, firstName, lastName, phone, createdAt);
		this.accountNumber = accountNumber;
		this.amount = amount;
	}
	
		
}
