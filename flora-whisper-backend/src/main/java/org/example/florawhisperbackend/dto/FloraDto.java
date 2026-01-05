package org.example.florawhisperbackend.dto;

import org.example.florawhisperbackend.entity.Color;
import org.example.florawhisperbackend.entity.Season;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record FloraDto() {

    public record CategoryDto(
            long categoryId,
            String categoryName
    ) {}

    public record FlowerMeaningDto(
            String name,
            String scientificName,
            String meaning,
            String symbolism,
            String description,
            String plantingGuide,
            String careInstructions,
            Season season,
            List<String> occasions,
            List<String> culturalMeanings,
            List<String> imageUrls,
            String bloomingPeriod,
            String colorVarieties,
            Map<Color, String> colorMeanings,
            String originCountry,
            Boolean isPerennial
    ) {}

    public record FlowerMeaningResponseDto(
            Long id,
            String name,
            String scientificName,
            String meaning,
            String symbolism,
            String description,
            String plantingGuide,
            String careInstructions,
            Season season,
            List<String> occasions,
            List<String> culturalMeanings,
            List<String> imageUrls,
            String bloomingPeriod,
            String colorVarieties,
            Map<Color, String> colorMeanings,
            String originCountry,
            Boolean isPerennial
    ) {}

    public record LoginRequest(
            String userNameOrEmail,
            String password
    ) { }

    public record RegisterDto(
           String username,
           String password,
           String email,
           String firstName,
           String lastName,
           String phone,
           LocalDate createdAt,
           MultipartFile img,
           BigDecimal amount
    ) {}

    public record TransferRequest(String fromAccountNumber, String toAccountNumber, double amount, String username, String code) {
    }

    public record WithDrawRequest(String accountNumber, double amount, String username, String code) {
    }

    public record CheckoutRequestDto(
         Map<Long, Integer> plantQuantities,
         double totalAmount,
         String customerEmail,
         String shippingAddress,
         String customerNotes,
         String fromAccountNumber,
         String paymentUsername,
         String code
    ) {}

}
