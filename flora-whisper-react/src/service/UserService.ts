import type { RegisterDto } from "../dto/RegisterDto";
import api from "./AuthService";

export interface UserProfileDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  img?: File | string;
}

// service/UserService.ts
export const getCurrentUserProfile = () => {
  return api.get<UserProfileDto>("/user/profile");
};

export const updateUserProfile = (
  id: number,
  updateData: RegisterDto | FormData
) => {
  if (updateData instanceof FormData) {
    return api.put(`/user/${id}`, updateData);
  }

  if (updateData.img) {
    const formData = new FormData();

    if (updateData.username) formData.append("username", updateData.username);
    if (updateData.email) formData.append("email", updateData.email);
    if (updateData.password) formData.append("password", updateData.password);
    if (updateData.phone) formData.append("phone", updateData.phone);
    if (updateData.firstName)
      formData.append("firstName", updateData.firstName);
    if (updateData.lastName) formData.append("lastName", updateData.lastName);

    formData.append("img", updateData.img as unknown as File);

    return api.put(`/user/${id}`, formData);
  }

  return api.put(`/user/${id}`, updateData);
};
