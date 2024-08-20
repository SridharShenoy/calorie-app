import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  UserType,
} from "../../backend/src/models/user";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import axios from 'axios';

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};
export const fetchMyImages = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/me/images`);
    
    const images: string[] = response.data.images;

    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const addMyImage = async (imageFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-images`, {
    method: "POST",
    credentials: "include",
    body: imageFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add image");
  }

  return response.json();
};
