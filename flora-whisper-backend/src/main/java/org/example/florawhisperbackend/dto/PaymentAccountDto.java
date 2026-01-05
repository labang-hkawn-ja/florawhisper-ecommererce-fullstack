package org.example.florawhisperbackend.dto;

import java.math.BigDecimal;

public class PaymentAccountDto {
	
	private Long id;	
	private String name;
	private String accountNumber;
	private BigDecimal amount;
	
	public PaymentAccountDto() {
		super();
	}

	public PaymentAccountDto(Long id, String name, String accountNumber, BigDecimal amount) {
		super();
		this.id = id;
		this.name = name;
		this.accountNumber = accountNumber;
		this.amount = amount;
	}
	
}
