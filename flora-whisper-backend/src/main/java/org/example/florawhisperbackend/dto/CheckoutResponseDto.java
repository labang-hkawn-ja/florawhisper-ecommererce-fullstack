package org.example.florawhisperbackend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor
public class CheckoutResponseDto {
    private Long id;
    private String orderCode;
    private LocalDate orderDate;
    private double totalAmount;
    private int totalItems;
    private String status;
    private String shippingStatus;
    private String shippingAddress;
    private String customerNotes;
    private LocalDate expectedDeliveryDate;
    private String customerName;
    private String customerEmail;
    private List<CheckoutPlantItemDto> plants;
    private Map<Long, Integer> plantQuantities;
}
