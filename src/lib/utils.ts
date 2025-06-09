import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HealthProfileUpdate, UserSupplementCreate } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Form validation utilities
export const validateHealthProfile = (data: HealthProfileUpdate) => {
  const errors: Record<string, string> = {};

  if (!data.birth_date) {
    errors.birth_date = "Birth date is required";
  } else {
    const birthDate = new Date(data.birth_date);
    const today = new Date();
    if (birthDate > today) {
      errors.birth_date = "Birth date cannot be in the future";
    }
  }

  if (!data.height || data.height <= 0) {
    errors.height = "Height must be greater than 0";
  } else if (data.height < 50 || data.height > 300) {
    errors.height = "Height must be between 50-300 cm";
  }

  if (!data.weight || data.weight <= 0) {
    errors.weight = "Weight must be greater than 0";
  } else if (data.weight < 10 || data.weight > 500) {
    errors.weight = "Weight must be between 10-500 kg";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSupplement = (data: UserSupplementCreate) => {
  const errors: Record<string, string> = {};

  if (!data.supplement_id) {
    errors.supplement_id = "Supplement selection is required";
  }

  if (!data.start_date) {
    errors.start_date = "Start date is required";
  }

  if (data.end_date && data.start_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    if (endDate < startDate) {
      errors.end_date = "End date must be after start date";
    }
  }

  if (!data.dosage?.trim()) {
    errors.dosage = "Dosage is required";
  }

  if (!data.frequency?.trim()) {
    errors.frequency = "Frequency is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Business logic utilities
export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return Math.max(0, age);
};

export const calculateBMI = (weight: number, height: number): number => {
  if (weight <= 0 || height <= 0) return 0;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getSupplementStatus = (startDate: string, endDate: string | null): "active" | "upcoming" | "completed" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (start > now) return "upcoming";
  if (end && end < now) return "completed";
  return "active";
};

// Error handling utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
};

export const retryAsync = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryAsync(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};
