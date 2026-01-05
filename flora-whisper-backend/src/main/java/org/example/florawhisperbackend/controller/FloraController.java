package org.example.florawhisperbackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.florawhisperbackend.dto.CheckoutResponseDto;
import org.example.florawhisperbackend.dto.FloraDto.*;
import org.example.florawhisperbackend.dto.PlantCreateDto;
import org.example.florawhisperbackend.dto.PlantDto;
import org.example.florawhisperbackend.entity.Color;
import org.example.florawhisperbackend.entity.ShippingStatus;
import org.example.florawhisperbackend.entity.User;
import org.example.florawhisperbackend.service.FloraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/flora")
public class FloraController {
    private final FloraService floraService;

    // CATEGORY
    record CategoryRequest(String categoryName) {}

    @GetMapping("/categories")
    public List<CategoryDto> listAllCategories() {
        return floraService.findAllCategories();
    }

    @GetMapping("/categories/{id}")
    public CategoryDto listCategoryById(@PathVariable("id") long id) {
        return floraService.findCategoryById(id);
    }

    @PostMapping("/category")
    public ResponseEntity<String> createCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(floraService.createCategory(request.categoryName));
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable("id") long id, @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(floraService.updateCategory(id, request.categoryName));
    }

    // PLANT
    @GetMapping("/plants")
    public List<PlantDto> listAllPlants() {
        return floraService.findAllPlants();
    }

    @GetMapping("/plants/category/{id}")
    public List<PlantDto> findAllPlantsByCategoryId(@PathVariable long id) {
        return floraService.findPlantsByCategoryId(id);
    }

    @DeleteMapping("/plants/{id}")
    public ResponseEntity<String> deletePlant(@PathVariable long id) {
        String respString = floraService.deletePlantById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(respString);
    }

    @GetMapping("/plants/{id}")
    public ResponseEntity<PlantDto> getPlantById(@PathVariable long id) {
        PlantDto plantDto = floraService.findPlantById(id);
        return ResponseEntity.ok(plantDto);
    }

    @PostMapping("/plants/plant")
    public ResponseEntity<String> createPlant(
            @ModelAttribute PlantCreateDto plantCreateDto) throws IOException {
        String message = floraService.createPlant(plantCreateDto);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/plants/plant/{id}")
    public ResponseEntity<String> updatePlant(
            @PathVariable Long id,
            @ModelAttribute PlantCreateDto plantCreateDto) throws IOException {
        String message = floraService.updatePlant(id, plantCreateDto);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/plants/search")
    public ResponseEntity<?> searchPlants(
            @RequestParam Long categoryId,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String name) {

        try {
            List<PlantDto> results = floraService.searchPlants(categoryId, color, name);
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Internal server error")
            );
        }
    }

    // FLOWER MEANING

    @GetMapping("/flower-meanings")
    public List<FlowerMeaningResponseDto> listAllFlowerMeanings() {
        return floraService.findAllFlowerMeanings();
    }

    @GetMapping("/flower-meanings/{id}")
    public FlowerMeaningResponseDto listFlowerMeaningById(@PathVariable long id) {
        return floraService.findFlowerMeaningById(id);
    }

    @PostMapping("/flower-meaning")
    public ResponseEntity<FlowerMeaningResponseDto> createFlowerMeaning(
            @RequestBody FlowerMeaningDto flowerMeaningDto) {
        FlowerMeaningResponseDto createdFlower = floraService.createFlowerMeaning(flowerMeaningDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFlower);
    }

    @PutMapping("/flower-meaning/{id}")
    public ResponseEntity<FlowerMeaningResponseDto> updateFlowerMeaning(
            @PathVariable long id, @RequestBody FlowerMeaningDto flowerMeaningDto) {
        FlowerMeaningResponseDto updatedFlower = floraService.updateFlowerMeaning(id, flowerMeaningDto);
        return ResponseEntity.ok(updatedFlower);
    }

    @DeleteMapping("/flower-meaning/{id}")
    public ResponseEntity<String> deleteFlowerMeaning(@PathVariable long id) {
        String respString = floraService.deleteFlowerMeaningById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(respString);
    }

    // CHECKOUT


    @PostMapping("/checkout")
    public ResponseEntity<?> processCheckout(@RequestBody CheckoutRequestDto request) {
        try {
            CheckoutResponseDto response = floraService.processCheckout(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Checkout processing failed")
            );
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<CheckoutResponseDto>> getCheckoutHistory(
            Principal principal) {
        System.out.println("Principal Name:" + principal.getName());
        List<CheckoutResponseDto> history = floraService.getCheckoutHistory(principal.getName());
        return ResponseEntity.ok(history);
    }

    @GetMapping
    public List<CheckoutResponseDto> getAllOrders() {
        return floraService.getAllOrders();
    }

    @PutMapping("/{orderId}/status/{newStatus}")
    public CheckoutResponseDto updateOrderStatus(
            @PathVariable Long orderId,
            @PathVariable ShippingStatus newStatus) {
        return floraService.updateOrderStatus(orderId, newStatus);
    }


}
