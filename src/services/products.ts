// src/services/products.ts
import api from "./api";

export async function fetchProducts() {
  try {
    const response = await api.get("/products");

    // Un solo console.log con información clara
    console.log("📊 PRODUCTOS:", JSON.stringify(response.data, null, 2));
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    // Un solo console.error para los errores
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

export async function fetchProductById(id: string) {
  try {
    const response = await api.get(`/products/${id}`);

    // Logs antes del return para asegurar que se ejecuten
    console.log("product by id", JSON.stringify(response.data, null, 2));
    console.log(response.data);
    
    return response.data;
  } catch (error: unknown) { // Agregado tipo 'unknown' para el error
    // Manejo de error similar al de fetchProducts
    if (error instanceof Error && "response" in error) {
      const axiosError = error as any;
      console.error(
        "❌ ERROR PRODUCTO:",
        axiosError.message,
        axiosError.response?.status
      );
    } else {
      console.error("❌ ERROR:", error);
    }
    throw error;
  }
}