package org.example.florawhisperbackend.service;

import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.example.florawhisperbackend.dao.*;
import org.example.florawhisperbackend.dto.*;
import org.example.florawhisperbackend.dto.FloraDto.*;
import org.example.florawhisperbackend.entity.*;
import org.example.florawhisperbackend.exception.AlreadyExistException;
import org.example.florawhisperbackend.exception.InsufficientException;
import org.example.florawhisperbackend.exception.NotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FloraService {
    private final CategoryDao categoryDao;
    private final FlowerDao flowerDao;
    private final IndoorPlantDao indoorPlantDao;
    private final FlowerMeaningDao flowerMeaningDao;
    private final CustomerDao customerDao;
    private final CheckoutDao checkoutDao;
    private final PlantDao plantDao;
    private final PaymentAccountInterface paymentService;

    // CATEGORY
    public List<CategoryDto> findAllCategories() {
        return categoryDao.findAll().stream().map(this::toCategoryDto).toList();
    }

    public CategoryDto findCategoryById(Long id) {
        Category category = categoryDao.findById(id).orElse(null);
        if (Objects.isNull(category)) {
            throw new NotFoundException("Category not found with id: " + id);
        }
        return toCategoryDto(category);
    }

    public String createCategory(String categoryName) {
        if (categoryDao.findByCategoryName(categoryName).isPresent()) {
            throw new AlreadyExistException("Category %s already exists!".formatted(categoryName));
        }
        Category category = new Category(categoryName);
        categoryDao.save(category);
        return "Category %s successfully created!".formatted(categoryName);
    }

    public CategoryDto updateCategory(Long id, String categoryName) {
        Category category = categoryDao.findById(id).orElse(null);
        if (Objects.isNull(category)) {
            throw new NotFoundException("Category not found with id : " + id);
        }
        category.setId(id);
        category.setCategoryName(categoryName);
        return toCategoryDto(categoryDao.save(category));
    }

    private CategoryDto toCategoryDto(Category category) {
        return new CategoryDto(category.getId(), category.getCategoryName());
    }

    // PLANTS

    public List<PlantDto> findAllPlants() {
        return plantDao.findAll().stream()
                .map(this::toPlantDto)
                .toList();
    }

    public List<PlantDto> findPlantsByCategoryId(long categoryId) {
        return plantDao.findByCategoryId(categoryId).stream()
                .map(this::toPlantDto)
                .toList();
    }

    public PlantDto findPlantById(long id) {
        Plant plant = plantDao.findById(id).orElseThrow(() -> new NotFoundException("Plant not found with id: " + id));
        return toPlantDto(plant);
    }

    @Transactional
    public String createPlant(PlantCreateDto plantCreateDto) throws IOException {
        Category category = categoryDao.findByCategoryName(plantCreateDto.getCategory()).orElse(null);
        if (category == null) {
            category = new Category();
            category.setCategoryName(plantCreateDto.getCategory());
            categoryDao.save(category); // Save new category if it doesn't exist
        }

        if (plantDao.findByCategoryNameAndName(category.getCategoryName(), plantCreateDto.getName()).isPresent()) {
            throw new AlreadyExistException("Plant name %s in category %s already exists!".formatted(plantCreateDto.getName(), category.getCategoryName()));
        }

        Plant plant;
        if ("blooms".equalsIgnoreCase(category.getCategoryName())) {
            Flower flower = new Flower();
            flower.setName(plantCreateDto.getName());
            flower.setDescription(plantCreateDto.getDescription());
            flower.setPrice(plantCreateDto.getPrice());
            flower.setStock(plantCreateDto.getStock());
            flower.setUpdatePrice(plantCreateDto.getUpdatePrice());
            flower.setImageUrl(plantCreateDto.getImageUrl().getBytes());
            flower.setColor(plantCreateDto.getColor());
            flower.setPiece(plantCreateDto.getPiece());
            plant = flower;
        } else if ("greenery".equalsIgnoreCase(category.getCategoryName())) {
            IndoorPlant indoorPlant = new IndoorPlant();
            indoorPlant.setName(plantCreateDto.getName());
            indoorPlant.setDescription(plantCreateDto.getDescription());
            indoorPlant.setPrice(plantCreateDto.getPrice());
            indoorPlant.setStock(plantCreateDto.getStock());
            indoorPlant.setUpdatePrice(plantCreateDto.getUpdatePrice());
            indoorPlant.setImageUrl(plantCreateDto.getImageUrl().getBytes());
            indoorPlant.setPlantSize(plantCreateDto.getPlantSize());
            indoorPlant.setIsEasyToCare(plantCreateDto.getIsEasyToCare());
            indoorPlant.setCareInstructions(plantCreateDto.getCareInstructions());
            plant = indoorPlant;
        } else {
            throw new NotFoundException("Invalid plant type: " + category.getCategoryName());
        }

        plant.setCategory(category);
        category.addPlant(plant);
        plantDao.save(plant);
        return "Plant %s successfully created!".formatted(plantCreateDto.getName());
    }

    @Transactional
    public String updatePlant(Long plantId, PlantCreateDto plantCreateDto) throws IOException {
        Plant existingPlant = plantDao.findById(plantId)
                .orElseThrow(() -> new NotFoundException("Plant not found with id: " + plantId));

        // Update only provided fields
        if (plantCreateDto.getName() != null && !plantCreateDto.getName().trim().isEmpty()) {
            existingPlant.setName(plantCreateDto.getName());
        }
        if (plantCreateDto.getDescription() != null && !plantCreateDto.getDescription().trim().isEmpty()) {
            existingPlant.setDescription(plantCreateDto.getDescription());
        }
        if (plantCreateDto.getPrice() > 0) {
            existingPlant.setPrice(plantCreateDto.getPrice());
        }
        if (plantCreateDto.getStock() > 0) {
            existingPlant.setStock(plantCreateDto.getStock());
        }
        if (plantCreateDto.getUpdatePrice() > 0) {
            existingPlant.setUpdatePrice(plantCreateDto.getUpdatePrice());
        }
        if (plantCreateDto.getImageUrl() != null && !plantCreateDto.getImageUrl().isEmpty()) {
            existingPlant.setImageUrl(plantCreateDto.getImageUrl().getBytes());
        }

        // Handle category-specific fields based on current plant type
        if (existingPlant instanceof Flower) {
            Flower flower = (Flower) existingPlant;
            if (plantCreateDto.getColor() != null) {
                flower.setColor(plantCreateDto.getColor());
            }
            if (plantCreateDto.getPiece() > 0) {
                flower.setPiece(plantCreateDto.getPiece());
            }
        } else if (existingPlant instanceof IndoorPlant) {
            IndoorPlant indoorPlant = (IndoorPlant) existingPlant;
            if (plantCreateDto.getPlantSize() != null && !plantCreateDto.getPlantSize().trim().isEmpty()) {
                indoorPlant.setPlantSize(plantCreateDto.getPlantSize());
            }
            if (plantCreateDto.getIsEasyToCare() != null) {
                indoorPlant.setIsEasyToCare(plantCreateDto.getIsEasyToCare());
            }
            if (plantCreateDto.getCareInstructions() != null && !plantCreateDto.getCareInstructions().trim().isEmpty()) {
                indoorPlant.setCareInstructions(plantCreateDto.getCareInstructions());
            }
        }

        plantDao.save(existingPlant);
        return "Plant " + existingPlant.getName() + " successfully updated!";
    }

    private static final Long FLOWER_CATEGORY_ID = 1L;
    private static final Long INDOOR_PLANT_CATEGORY_ID = 2L;

    public List<PlantDto> searchPlants(Long categoryId, String color, String name) {
        // Validate inputs
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }

        if (!FLOWER_CATEGORY_ID.equals(categoryId) && !INDOOR_PLANT_CATEGORY_ID.equals(categoryId)) {
            throw new IllegalArgumentException("Invalid category ID: " + categoryId);
        }

        // Convert empty strings to null
        String processedColor = StringUtils.isBlank(color) ? null : color.trim();
        String processedName = StringUtils.isBlank(name) ? null : name.trim();

        try {
            if (FLOWER_CATEGORY_ID.equals(categoryId)) {
                return searchFlowers(processedColor, processedName);
            } else {
                return searchIndoorPlants(processedName);
            }
        } catch (Exception e) {
            System.err.println("Error searching plants: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<PlantDto> searchFlowers(String color, String name) {
        boolean hasColor = StringUtils.isNotBlank(color);
        boolean hasName = StringUtils.isNotBlank(name);

        try {
            List<Plant> results;

            if (hasColor && hasName) {
                Color enumColor = Color.valueOf(color.toUpperCase());
                results = plantDao.findFlowersByColorAndNameContaining(enumColor, name);
            } else if (hasColor) {
                Color enumColor = Color.valueOf(color.toUpperCase());
                results = plantDao.findFlowersByColor(enumColor);
            } else if (hasName) {
                results = plantDao.findFlowersByNameContaining(name);
            } else {
                // No filters - return all flowers
                results = plantDao.findByCategoryId(FLOWER_CATEGORY_ID);
            }
            return convertToDto(results);

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid color value: " + color);
            return Collections.emptyList();
        }
    }

    private List<PlantDto> searchIndoorPlants(String name) {
        List<Plant> results;

        if (StringUtils.isNotBlank(name)) {
            results = plantDao.findIndoorPlantsByNameContaining(name);
        } else {
            // No filters - return all indoor plants
            results = plantDao.findByCategoryId(INDOOR_PLANT_CATEGORY_ID);
        }

        return convertToDto(results);
    }

    private List<PlantDto> convertToDto(List<Plant> plants) {
        if (plants == null) {
            return Collections.emptyList();
        }
        return plants.stream()
                .map(this::toPlantDto)
                .collect(Collectors.toList());
    }

    private PlantDto toPlantDto(Plant plant) {
        PlantDto plantDto = new PlantDto();
        // Common fields from Plant
        plantDto.setPlantId(plant.getId());
        plantDto.setName(plant.getName());
        plantDto.setDescription(plant.getDescription());
        plantDto.setPrice(plant.getPrice());
        plantDto.setStock(plant.getStock());
        plantDto.setImageUrl(plant.getImageUrl() != null
                ? Base64.getEncoder().encodeToString(plant.getImageUrl())
                : null);
        plantDto.setUpdatePrice(plant.getUpdatePrice());
        plantDto.setCategory(plant.getCategory() != null ? plant.getCategory().getCategoryName() : null);

        // Fields specific to Flower or IndoorPlant
        if (plant instanceof Flower flower) {
            plantDto.setColor(flower.getColor());
            plantDto.setPiece(flower.getPiece());
            // Set IndoorPlant-specific fields to null
            plantDto.setPlantSize(null);
            plantDto.setIsEasyToCare(null);
            plantDto.setCareInstructions(null);
        } else if (plant instanceof IndoorPlant indoorPlant) {
            plantDto.setPlantSize(indoorPlant.getPlantSize());
            plantDto.setIsEasyToCare(indoorPlant.getIsEasyToCare());
            plantDto.setCareInstructions(indoorPlant.getCareInstructions());
            // Set Flower-specific fields to null
            plantDto.setColor(null);
            plantDto.setPiece(0);
        }

        return plantDto;
    }

    // FLOWER MEANING

    public List<FlowerMeaningResponseDto> findAllFlowerMeanings() {
        return flowerMeaningDao.findAll().stream().map(this::mapToFlowerMeaningResponseDto).toList();
    }

    public FlowerMeaningResponseDto findFlowerMeaningById(long id) {
        FlowerMeaning flower = flowerMeaningDao.findById(id).orElseThrow(() -> new RuntimeException("Flower meaning not found with id: " + id));
        return mapToFlowerMeaningResponseDto(flower);
    }

    @Transactional
    public FlowerMeaningResponseDto createFlowerMeaning(FlowerMeaningDto flowerMeaningDto) {
        if (flowerMeaningDao.findByName(flowerMeaningDto.name().toLowerCase()).isPresent()) {
            throw new AlreadyExistException("Flower meaning name %s already exists!".formatted(flowerMeaningDto.name()));
        }
        FlowerMeaning flower = mapToFlowerMeaningEntity(flowerMeaningDto);
        FlowerMeaning savedFlower = flowerMeaningDao.save(flower);
        return mapToFlowerMeaningResponseDto(savedFlower);
    }

    @Transactional
    public FlowerMeaningResponseDto updateFlowerMeaning(long id, FlowerMeaningDto flowerMeaningDto) {
        FlowerMeaning existingFlower = flowerMeaningDao.findById(id).orElseThrow(() -> new NotFoundException("Flower meaning not found with id: " + id));

        if (flowerMeaningDto.name() != null) {
            existingFlower.setName(flowerMeaningDto.name());
        }
        if (flowerMeaningDto.scientificName() != null) {
            existingFlower.setScientificName(flowerMeaningDto.scientificName());
        }
        if (flowerMeaningDto.meaning() != null) {
            existingFlower.setMeaning(flowerMeaningDto.meaning());
        }
        if (flowerMeaningDto.symbolism() != null) {
            existingFlower.setSymbolism(flowerMeaningDto.symbolism());
        }
        if (flowerMeaningDto.description() != null) {
            existingFlower.setDescription(flowerMeaningDto.description());
        }
        if (flowerMeaningDto.plantingGuide() != null) {
            existingFlower.setPlantingGuide(flowerMeaningDto.plantingGuide());
        }
        if (flowerMeaningDto.careInstructions() != null) {
            existingFlower.setCareInstructions(flowerMeaningDto.careInstructions());
        }
        if (flowerMeaningDto.season() != null) {
            existingFlower.setSeason(flowerMeaningDto.season());
        }
        if (flowerMeaningDto.occasions() != null) {
            existingFlower.getOccasions().clear();
            flowerMeaningDto.occasions().forEach(existingFlower::addOccasion);
        }
        if (flowerMeaningDto.culturalMeanings() != null) {
            existingFlower.getCulturalMeanings().clear();
            flowerMeaningDto.culturalMeanings().forEach(existingFlower::addCulturalMeaning);
        }
        if (flowerMeaningDto.imageUrls() != null) {
            existingFlower.getImageUrls().clear();
            flowerMeaningDto.imageUrls().forEach(existingFlower::addImageUrl);
        }
        if (flowerMeaningDto.bloomingPeriod() != null) {
            existingFlower.setBloomingPeriod(flowerMeaningDto.bloomingPeriod());
        }
        if (flowerMeaningDto.colorVarieties() != null) {
            existingFlower.setColorVarieties(flowerMeaningDto.colorVarieties());
        }
        if (flowerMeaningDto.colorMeanings() != null) {
            existingFlower.getColorMeanings().clear();
            existingFlower.getColorMeanings().putAll(flowerMeaningDto.colorMeanings());
        }
        if (flowerMeaningDto.originCountry() != null) {
            existingFlower.setOriginCountry(flowerMeaningDto.originCountry());
        }
        if (flowerMeaningDto.isPerennial() != null) {
            existingFlower.setIsPerennial(flowerMeaningDto.isPerennial());
        }

        FlowerMeaning updatedFlower = flowerMeaningDao.save(existingFlower);
        return mapToFlowerMeaningResponseDto(updatedFlower);
    }

    public String deleteFlowerMeaningById(long id) {
        if (!flowerMeaningDao.existsById(id)) {
            throw new NotFoundException("Flower meaning not found with id: " + id);
        }
        flowerMeaningDao.deleteById(id);
        return "Flower meaning with id: " + id + " deleted successfully.";
    }

    private FlowerMeaningResponseDto mapToFlowerMeaningResponseDto(FlowerMeaning flower) {
        return new FlowerMeaningResponseDto(
                flower.getId(),
                flower.getName(),
                flower.getScientificName(),
                flower.getMeaning(),
                flower.getSymbolism(),
                flower.getDescription(),
                flower.getPlantingGuide(),
                flower.getCareInstructions(),
                flower.getSeason(),
                new ArrayList<>(flower.getOccasions()),
                new ArrayList<>(flower.getCulturalMeanings()),
                new ArrayList<>(flower.getImageUrls()),
                flower.getBloomingPeriod(),
                flower.getColorVarieties(),
                new HashMap<>(flower.getColorMeanings()),
                flower.getOriginCountry(),
                flower.getIsPerennial()
        );
    }

    private FlowerMeaning mapToFlowerMeaningEntity(FlowerMeaningDto dto) {
        FlowerMeaning flower = new FlowerMeaning();
        flower.setName(dto.name().toLowerCase());
        flower.setScientificName(dto.scientificName());
        flower.setMeaning(dto.meaning());
        flower.setSymbolism(dto.symbolism());
        flower.setDescription(dto.description());
        flower.setPlantingGuide(dto.plantingGuide());
        flower.setCareInstructions(dto.careInstructions());
        flower.setSeason(dto.season());
        flower.setBloomingPeriod(dto.bloomingPeriod());
        flower.setColorVarieties(dto.colorVarieties());
        flower.setOriginCountry(dto.originCountry());
        flower.setIsPerennial(dto.isPerennial());

        if (dto.occasions() != null) {
            dto.occasions().forEach(flower::addOccasion);
        }
        if (dto.culturalMeanings() != null) {
            dto.culturalMeanings().forEach(flower::addCulturalMeaning);
        }
        if (dto.imageUrls() != null) {
            dto.imageUrls().forEach(flower::addImageUrl);
        }
        if (dto.colorMeanings() != null) {
            flower.getColorMeanings().putAll(dto.colorMeanings());
        }
        return flower;
    }

    // Checkout

    @Transactional
    public CheckoutResponseDto processCheckout(CheckoutRequestDto request) {
        // Validate customer
        Customer customer = customerDao.findByEmail(request.customerEmail())
                .orElseThrow(() -> new NotFoundException("Customer not found with email: " + request.customerEmail()));

        // Process payment first
        processPayment(request);

        // Create checkout
        Checkout checkout = new Checkout();
        checkout.setOrderDate(LocalDate.now());
        checkout.setTotalAmount(request.totalAmount());
        checkout.setCustomer(customer);
        checkout.setShippingAddress(request.shippingAddress());
        checkout.setCustomerNotes(request.customerNotes());
        checkout.setOrderCode(generateOrderCode());
        checkout.setStatus("PAID");
        checkout.setShippingStatus(ShippingStatus.PENDING);
        checkout.setExpectedDeliveryDate(null);

        // Process plants
        processPlantsAndQuantities(checkout, request.plantQuantities());

        // Save checkout
        Checkout savedCheckout = checkoutDao.save(checkout);
        return convertToResponse(savedCheckout);
    }

    private void processPayment(CheckoutRequestDto request) {
        try {
            // Process payment transfer
           paymentService.transferAmount(
                    request.fromAccountNumber(),
                    "ZJOHN161361",
                    request.totalAmount(),
                    request.paymentUsername(),
                    request.code()
           );

        } catch (Exception e) {
            throw new RuntimeException("Payment failed: " + e.getMessage(), e);
        }
    }

    private void processPlantsAndQuantities(Checkout checkout, Map<Long, Integer> plantQuantities) {
        for (Map.Entry<Long, Integer> entry : plantQuantities.entrySet()) {
            Long plantId = entry.getKey();
            Integer quantity = entry.getValue();

            Plant plant = plantDao.findById(plantId)
                    .orElseThrow(() -> new NotFoundException("Plant not found with id: " + plantId));

            // Check stock availability
            if (plant.getStock() < quantity) {
                throw new InsufficientException("Insufficient stock for " + plant.getName() +
                        ". Available: " + plant.getStock() + ", Requested: " + quantity);
            }

            // Update plant stock
            plant.setStock(plant.getStock() - quantity);
            plantDao.save(plant);

            // Add to checkout
            checkout.getPlants().add(plant);
            checkout.addPlantQuantity(plantId, quantity);
        }
    }

    private String generateOrderCode() {
        SecureRandom random = new SecureRandom();
        return "PLANT-" + System.currentTimeMillis() + "-" + random.nextInt(100000) + 100000;
    }

    private CheckoutResponseDto convertToResponse(Checkout checkout) {
        CheckoutResponseDto response = new CheckoutResponseDto();
        response.setId(checkout.getId());
        response.setOrderCode(checkout.getOrderCode());
        response.setOrderDate(checkout.getOrderDate());
        response.setTotalAmount(checkout.getTotalAmount());
        response.setTotalItems(checkout.getTotalItems());
        response.setStatus(checkout.getStatus());
        response.setShippingAddress(checkout.getShippingAddress());
        response.setCustomerNotes(checkout.getCustomerNotes());
        response.setShippingStatus(checkout.getShippingStatus().name());
        response.setExpectedDeliveryDate(checkout.getExpectedDeliveryDate());
        response.setPlantQuantities(checkout.getPlantQuantities());

        // Customer info
        if (checkout.getCustomer() != null) {
            String name = checkout.getCustomer().getFirstName() + " " + checkout.getCustomer().getLastName();
            response.setCustomerName(name);
            response.setCustomerEmail(checkout.getCustomer().getEmail());
        }

        // Convert plants
        List<CheckoutPlantItemDto> plantItems = checkout.getPlants().stream()
                .map(this::convertToCheckoutPlantItem)
                .toList();
        response.setPlants(plantItems);

        return response;
    }

    private CheckoutPlantItemDto convertToCheckoutPlantItem(Plant plant) {
        CheckoutPlantItemDto item = new CheckoutPlantItemDto();
        item.setId(plant.getId());
        item.setName(plant.getName());
        item.setDescription(plant.getDescription());
        item.setPrice(plant.getPrice());

        // Convert image
        if (plant.getImageUrl() != null) {
            item.setImageUrl(Base64.getEncoder().encodeToString(plant.getImageUrl()));
        }

        // Category
        if (plant.getCategory() != null) {
            item.setCategoryName(plant.getCategory().getCategoryName());
        }

        // Plant type specific fields
        if (plant instanceof Flower) {
            Flower flower = (Flower) plant;
            item.setPlantType("FLOWER");
            item.setColor(flower.getColor() != null ? flower.getColor().toString() : null);
            item.setPiece(flower.getPiece());
        } else if (plant instanceof IndoorPlant) {
            IndoorPlant indoorPlant = (IndoorPlant) plant;
            item.setPlantType("INDOOR_PLANT");
            item.setPlantSize(indoorPlant.getPlantSize());
            item.setEasyToCare(indoorPlant.getIsEasyToCare());
            item.setCareInstructions(indoorPlant.getCareInstructions());
        }

        return item;
    }

    public List<CheckoutResponseDto> getCheckoutHistory(String username) {
        System.out.println("Username::" + username);
        long id = customerDao.findByUsername(username).get().getId();
        System.out.println("ID::" + id);
        return checkoutDao.
                findByCustomerIdOrderByOrderDateDesc(id)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CheckoutResponseDto updateOrderStatus(Long orderId, ShippingStatus newStatus) {
        Checkout checkout = checkoutDao.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (newStatus == ShippingStatus.OUT_FOR_DELIVERY) {
            checkout.setShippingStatus(ShippingStatus.OUT_FOR_DELIVERY);
            checkout.setExpectedDeliveryDate(LocalDate.now().plusDays(1));
        } else if (newStatus == ShippingStatus.DELIVERED){
            checkout.setShippingStatus(ShippingStatus.DELIVERED);
        }

        Checkout updatedCheckout = checkoutDao.save(checkout);
        return convertToResponse(updatedCheckout);
    }

    public List<CheckoutResponseDto> getAllOrders() {
        return checkoutDao.findAllByOrderByOrderDateDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public String deletePlantById(long id) {
        if (!plantDao.existsById(id)) {
            throw new NotFoundException("Plant id %s is not exist!".formatted(id));
        }
        plantDao.deleteById(id);
        return "Plant successfully deleted!";
    }
}
