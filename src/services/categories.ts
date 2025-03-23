// src/services/categories.ts
import api from "./api";

export async function fetchCategories() {
  try {
    const response = await api.get("/categories");

    console.log("📊 CATEGORÍAS:", JSON.stringify(response.data, null, 2));
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error && "response" in error) {
      // Este es un error de axios
      const axiosError = error as any;
      console.error(
        "❌ ERROR API:",
        axiosError.message,
        axiosError.response?.status
      );
    } else {
      console.error("❌ ERROR:", error);
    }
    throw error;
  }
}
