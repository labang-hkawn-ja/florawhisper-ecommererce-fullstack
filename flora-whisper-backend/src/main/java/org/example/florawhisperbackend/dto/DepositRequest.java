package org.example.florawhisperbackend.dto;

public record DepositRequest(String accountNumber, double amount, String username, String code) {
}
