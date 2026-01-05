import type { CategoryDto } from "../dto/CategoryDto";
import type { FlowerLanguageDto } from "../dto/FlowerLanguageDto";
import type { PlantDto } from "../dto/PlantDto";
import api from "./AuthService";

interface SearchParams {
  categoryId: number;
  color?: string;
  name?: string;
}

export interface CheckoutRequestDto {
  plantQuantities: Map<number, number>;
  totalAmount: number;
  customerEmail: string;
  shippingAddress: string;
  customerNotes: string;
  fromAccountNumber: string;
  paymentUsername: string;
  code: string;
}

export interface CheckoutResponseDto {
  id?: number;
  orderCode?: string;
  orderDate?: string;
  totalAmount?: number;
  totalItems?: number;
  status?: string;
  shippingStatus?: string;
  shippingAddress?: string;
  customerNotes?: string;
  expectedDeliveryDate?: string;
  customerName?: string;
  customerEmail?: string;
  plants?: PlantDto[];
  plantQuantities?: Map<number, number>;
}

// service/FloraService.ts
export const createPlantApiCall = (plantDto: PlantDto, imageFile: File | null) => {
  const formData = new FormData();
  
  // Append all plant data
  Object.entries(plantDto).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  
  // Append image file
  if (imageFile) {
    formData.append('imageUrl', imageFile);
  }

  return api.post("/flora/plants/plant", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePlantApiCall = (id: number, plantDto: PlantDto, imageFile: File | null) => {
  const formData = new FormData();
  
  formData.append('name', plantDto.name);
  formData.append('description', plantDto.description);
  formData.append('price', plantDto.price.toString());
  formData.append('stock', plantDto.stock.toString());
  formData.append('updatePrice', plantDto.updatePrice.toString());
  formData.append('category', plantDto.category || '');
  
  if (plantDto.plantSize && plantDto.plantSize.trim() !== '') {
    formData.append('plantSize', plantDto.plantSize);
  }
  if (plantDto.color && plantDto.color.trim() !== '') {
    formData.append('color', plantDto.color);
  }
  if (plantDto.piece && plantDto.piece > 0) {
    formData.append('piece', plantDto.piece.toString());
  }
  if (plantDto.careInstructions && plantDto.careInstructions.trim() !== '') {
    formData.append('careInstructions', plantDto.careInstructions);
  }
  if (plantDto.isEasyToCare !== undefined) {
    formData.append('isEasyToCare', plantDto.isEasyToCare.toString());
  }
  
  if (imageFile) {
    formData.append('imageUrl', imageFile);
  }

  console.log("=== FORM DATA BEING SENT ===");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value, `(type: ${typeof value})`);
  }

  return api.put(`/flora/plants/plant/${id}`, formData, {
    headers: { 
      'Content-Type': 'multipart/form-data'
    },
  });
};

export const getAllCategoriesApiCall = () =>
    api.get<CategoryDto[]>("/flora/categories"); 

export const getAllPlantsApiCall = () => 
    api.get<PlantDto[]>("/flora/plants");

export const getAllPlantsByCategoryIdApiCall = (id: number) => 
    api.get(`/flora/plants/category/${id}`);

export const getPlantByIdApiCall = (id: number) => 
  api.get(`/flora/plants/${id}`);

export const deletePlantApiCall = (id: number) => {
  return api.delete(`/flora/plants/${id}`);
};

export const searchPlantsApiCall = (categoryId: number, color: string, name: string) => {
  const params: SearchParams = { categoryId };
    if (color) params.color = color;
    if (name) params.name = name;
    
    console.log('API Call - URL:', "/flora/plants/search");
    console.log('API Call - Params:', params);
  
  return api.get("/flora/plants/search", { params });
};

export const processCheckout = (checkoutRequest: CheckoutRequestDto) => {
  console.log("Processing checkout...", checkoutRequest);
  
  // Convert Map to object for JSON serialization (matches your backend Map<Long, Integer>)
  const requestData = {
    ...checkoutRequest,
    plantQuantities: Object.fromEntries(checkoutRequest.plantQuantities)
  };

  return api.post<CheckoutResponseDto>("/flora/checkout", requestData);
};

export const getCheckoutHistory = () => {
  return api.get<CheckoutResponseDto[]>(`/flora/history`);
};

export const getAllOrdersApiCall = () => {
  return api.get<CheckoutResponseDto[]>('/flora');
};

export const updateOrderStatusApiCall = (orderId: number, newStatus: string) => {
  return api.put<CheckoutResponseDto>(`/flora/${orderId}/status/${newStatus}`);
};

export const getAllFlowerMeaningsApiCall = () => api.get<FlowerLanguageDto[]>("/flora/flower-meanings");

export const getFlowerMeaningsByIdApiCall = (id: number) => api.get<FlowerLanguageDto>(`/flora/flower-meanings/${id}`);

export const createFlowerMeaningApiCall = (flowerMeaning: FlowerLanguageDto) => {
  return api.post<FlowerLanguageDto>('/flora/flower-meaning', flowerMeaning);
};

export const updateFlowerMeaningApiCall = (id: number, flowerMeaning: FlowerLanguageDto) => {
  return api.put<FlowerLanguageDto>(`/flora/flower-meaning/${id}`, flowerMeaning);
};

export const deleteFlowerMeaningApiCall = (id: number) => {
  return api.delete(`/flora/flower-meaning/${id}`);
};

export const calculateOrderTotal = (subtotal: number) => {
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { shipping, tax, total };
};


