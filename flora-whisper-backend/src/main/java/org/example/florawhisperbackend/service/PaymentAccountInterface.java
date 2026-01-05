package org.example.florawhisperbackend.service;

public interface PaymentAccountInterface {
	double deposit(String accountNumber, double amount, String username, String code);
	double withdraw(String accountNumber, double amount, String username, String code);
	double transferAmount(String fromAccountNumber, String toAccountNumber, double amount, String username, String code);
}
