// src/services/auth.ts
import api from "./api";
import { ValidationService } from "../utils/validation";
import { AxiosError } from "axios";

// Interfaz para respuestas de error de la API
interface ApiErrorResponse {
  message?: string;
  error?: string | string[];
  statusCode?: number;
  code?: string;
  success?: boolean;
}

// Interfaz para las respuestas de éxito de la API
interface ApiSuccessResponse {
  message?: string;
  success?: boolean;
  token?: string;
  id?: string;
  email?: string;
  realName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
}

// Interfaz para las funciones toast opcionales
interface ToastFunctions {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info?: (title: string, message?: string) => void;
  warning?: (title: string, message?: string) => void;
}

export async function registerUser(
  userData: {
    email: string;
    password: string;
    realName: string;
    lastName: string;
    phoneNumber: string;
    secretWord: string;
    role?: string;
  },
  toastFn?: ToastFunctions
) {
  // Validación específica de contraseña
  const passwordValidation = ValidationService.validatePassword(
    userData.password
  );
  if (!passwordValidation.valid) {
    if (toastFn?.error) {
      toastFn.error(
        "Contraseña inválida",
        passwordValidation.message ||
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial"
      );
    }
    throw new Error(passwordValidation.message || "Contraseña inválida");
  }

  // Validación específica de palabra secreta
  const secretWordValidation = ValidationService.validateSecretWord(
    userData.secretWord
  );
  if (!secretWordValidation.valid) {
    if (toastFn?.error) {
      toastFn.error(
        "Palabra secreta inválida",
        secretWordValidation.message ||
          "La palabra secreta debe tener al menos 4 caracteres"
      );
    }
    throw new Error(secretWordValidation.message);
  }

  // Validación del resto de campos
  const validation = ValidationService.validateRegistrationForm(userData);
  if (!validation.valid) {
    if (toastFn?.error) {
      toastFn.error("Error de validación", validation.errors[0]);
    }
    if (validation.errors.length > 1) {
      console.warn("Errores adicionales:", validation.errors.slice(1));
    }
    throw new Error(validation.errors[0]);
  }

  try {
    console.log("📤 Datos de registro a enviar:", {
      ...userData,
      password: "****",
      secretWord: "****",
    });

    // Mostrar mensaje de procesamiento
    if (toastFn?.info) {
      toastFn.info("Procesando", "Enviando datos de registro...");
    }

    const response = await api.post("/register", userData);
    console.log(
      "📢 Respuesta de registro:",
      JSON.stringify(response.data, null, 2)
    );

    // Manejar respuesta exitosa según la estructura del API
    if (response.data.success) {
      if (toastFn?.success) {
        // Detectar si se requiere verificación por email
        if (response.data.message?.includes("verifica tu correo")) {
          toastFn.success(
            "Registro iniciado",
            "Verifica tu correo electrónico para completar el registro"
          );
        } else {
          toastFn.success(
            "Registro exitoso",
            response.data.message || "¡Tu cuenta ha sido creada correctamente!"
          );
        }
      }
      return response.data;
    } else {
      // Si hay respuesta pero no es exitosa
      if (toastFn?.warning) {
        toastFn.warning(
          "Atención",
          response.data.message || "El registro requiere pasos adicionales"
        );
      }
      return response.data;
    }
  } catch (error: unknown) {
    console.error("❌ Error en registro:", error);

    // Extraer mensaje de error de la respuesta
    let errorMessage = "No se pudo completar el registro";
    let errorCode = "";

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.log(
        "📊 Respuesta de error del servidor:",
        JSON.stringify(axiosError.response?.data, null, 2)
      );

      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status;

      if (errorData) {
        // Capturar código de error si existe
        errorCode = errorData.code || "";

        // Extraer mensaje de error según la estructura
        if (Array.isArray(errorData)) {
          errorMessage = errorData.join(". ");
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage =
            typeof errorData.error === "string"
              ? errorData.error
              : Array.isArray(errorData.error)
              ? errorData.error.join(". ")
              : "Error desconocido";
        }

        // Mensajes específicos para códigos de estado HTTP
        if (statusCode === 400) {
          // Manejo específico para validaciones de campos
          if (errorMessage.toLowerCase().includes("correo")) {
            errorMessage = "Este correo electrónico ya está registrado";
          } else if (errorMessage.toLowerCase().includes("contraseña")) {
            errorMessage =
              "La contraseña no cumple con los requisitos de seguridad";
          }
        } else if (statusCode === 409) {
          errorMessage = "Ya existe una cuenta con este correo electrónico";
        } else if (statusCode === 429) {
          errorMessage = "Demasiados intentos. Por favor, inténtelo más tarde";
        }
      }
    }

    // Personalizar mensaje basado en el código de error
    if (errorCode === "SESSION_EXPIRED") {
      errorMessage = "La sesión ha expirado. Inicia el registro nuevamente";
    } else if (errorCode === "CODE_EXPIRED") {
      errorMessage =
        "El código de verificación ha expirado. Solicita uno nuevo";
    }

    // Mostrar error en toast
    if (toastFn?.error) {
      toastFn.error("Error de registro", errorMessage);
    }

    throw error;
  }
}

// Añadir estas funciones al final del archivo auth.ts

// Verificar el código de email
// En la función verifyEmailCode, asegurémonos de manejar los códigos de error específicos:

export async function verifyEmailCode(
  data: { email: string; code: string },
  toastFn?: ToastFunctions
) {
  try {
    if (toastFn?.info) {
      toastFn.info("Verificando", "Comprobando código de verificación...");
    }

    const response = await api.post("/verify-email-code", data);
    console.log("📢 Verificación:", JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      if (toastFn?.success) {
        toastFn.success(
          "¡Verificación exitosa!",
          "Tu cuenta ha sido activada correctamente"
        );
      }
    } else {
      if (toastFn?.warning) {
        toastFn.warning(
          "Atención",
          response.data.message || "La verificación requiere pasos adicionales"
        );
      }
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error en verificación:", error);

    let errorMessage = "No se pudo verificar el código";
    let errorCode = "";

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;

      if (errorData) {
        // Capturar código de error si existe
        if (typeof errorData === "object" && "code" in errorData) {
          errorCode = (errorData.code as string) || "";
        }

        // Extraer mensaje de error según la estructura
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (typeof errorData === "object") {
          if ("message" in errorData) {
            errorMessage = errorData.message as string;
          } else if (Array.isArray(errorData)) {
            errorMessage = errorData.join(". ");
          }
        }

        // Personalizar mensaje basado en el código de error
        if (errorCode === "CODE_EXPIRED") {
          errorMessage =
            "El código de verificación ha expirado. Solicita uno nuevo";

          // Notificación específica para este error
          if (toastFn?.warning) {
            toastFn.warning(
              "Código expirado",
              "El código de verificación ha expirado. Por favor solicita uno nuevo."
            );
          }
        } else if (errorCode === "SESSION_EXPIRED") {
          errorMessage = "La sesión ha expirado. Inicia el registro nuevamente";

          // Notificación específica para este error
          if (toastFn?.warning) {
            toastFn.warning(
              "Sesión expirada",
              "Tu sesión ha expirado. Por favor inicia el registro nuevamente."
            );
          }
        }
      }
    }

    if (toastFn?.error) {
      toastFn.error("Error de verificación", errorMessage);
    }

    throw error;
  }
}
// Reenviar código de verificación
export async function resendVerificationCode(
  email: string,
  toastFn?: ToastFunctions
) {
  try {
    if (toastFn?.info) {
      toastFn.info("Procesando", "Enviando nuevo código de verificación...");
    }

    const response = await api.post("/send-verification-code", { email });
    console.log(
      "📢 Reenvío de código:",
      JSON.stringify(response.data, null, 2)
    );

    if (toastFn?.success) {
      toastFn.success(
        "Código enviado",
        "Revisa tu correo electrónico para obtener el nuevo código de verificación"
      );
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error al reenviar código:", error);

    let errorMessage = "No se pudo enviar el código";

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;

      if (
        errorData &&
        typeof errorData === "object" &&
        "message" in errorData
      ) {
        errorMessage = errorData.message as string;
      }
    }

    if (toastFn?.error) {
      toastFn.error("Error al enviar código", errorMessage);
    }

    throw error;
  }
}
export async function loginUser(
  credentials: { email: string; password: string },
  toastFn?: ToastFunctions
) {
  // Validar email y password básicos
  const emailValidation = ValidationService.validateEmail(credentials.email);
  if (!emailValidation.valid) {
    if (toastFn?.error) {
      toastFn.error("Error de validación", emailValidation.message!);
    }
    throw new Error(emailValidation.message);
  }

  if (!credentials.password) {
    if (toastFn?.error) {
      toastFn.error("Error de validación", "La contraseña es obligatoria");
    }
    throw new Error("La contraseña es obligatoria");
  }

  try {
    if (toastFn?.info) {
      toastFn.info("Procesando", "Iniciando sesión...");
    }

    const response = await api.post("/login", credentials);
    console.log("📢 Login:", JSON.stringify(response.data, null, 2));

    // Mostrar notificación de éxito
    if (toastFn?.success) {
      toastFn.success(
        "¡Bienvenido!",
        `Hola ${
          response.data.realName || "de nuevo"
        }. Has iniciado sesión correctamente`
      );
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error en login:", error);

    // Extraer mensaje de error
    let errorMessage = "No se pudo iniciar sesión";

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;
      const statusCode = axiosError.response?.status;

      // Mensajes personalizados basados en status code comunes
      if (statusCode === 400) {
        if (Array.isArray(errorData) && errorData.length > 0) {
          // La API devuelve un array con mensajes de error
          if (errorData[0].includes("no encontrado")) {
            errorMessage = "El correo electrónico no está registrado";
          } else if (errorData[0].includes("incorrecta")) {
            errorMessage = "La contraseña ingresada es incorrecta";
          } else {
            errorMessage = errorData[0];
          }
        } else if (errorData) {
          if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage =
              typeof errorData.error === "string"
                ? errorData.error
                : "Error desconocido";
          }
        }
      } else if (statusCode === 401) {
        errorMessage = "Credenciales inválidas";
      } else if (statusCode === 403) {
        errorMessage = "Tu cuenta está bloqueada o requiere verificación";
      } else if (statusCode === 429) {
        errorMessage = "Demasiados intentos fallidos. Espera unos minutos";
      }
    }

    // Mostrar error en toast
    if (toastFn?.error) {
      toastFn.error("Error de inicio de sesión", errorMessage);
    }

    throw error;
  }
}

export async function getProfile(toastFn?: ToastFunctions) {
  try {
    const response = await api.get("/profile");
    console.log("📢 Perfil:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error al cargar perfil:", error);

    let errorMessage = "No se pudo cargar tu perfil";

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 401) {
        errorMessage = "Tu sesión ha expirado. Inicia sesión nuevamente.";
      }
    }

    if (toastFn?.error) {
      toastFn.error("Error de perfil", errorMessage);
    }

    throw error;
  }
}

export async function logoutUser(toastFn?: ToastFunctions) {
  try {
    const response = await api.post("/logout");
    console.log("📢 Logout:", JSON.stringify(response.data, null, 2));

    if (toastFn?.info) {
      toastFn.info("Sesión finalizada", "Has cerrado sesión correctamente");
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error en logout:", error);

    if (toastFn?.error) {
      toastFn.error("Error", "No se pudo cerrar la sesión");
    }

    throw error;
  }
}

export async function forgotPassword(email: string, toastFn?: ToastFunctions) {
  try {
    if (!email || !ValidationService.validateEmail(email).valid) {
      if (toastFn?.error) {
        toastFn.error("Email inválido", "Debes proporcionar un email válido");
      }
      throw new Error("Email inválido");
    }

    if (toastFn?.info) {
      toastFn.info("Procesando", "Enviando solicitud de recuperación...");
    }

    const response = await api.post("/forgot-password", { email });
    console.log(
      "📢 Solicitud de recuperación:",
      JSON.stringify(response.data, null, 2)
    );

    if (toastFn?.success) {
      toastFn.success(
        "Email enviado",
        "Se ha enviado un correo con instrucciones para recuperar tu contraseña"
      );
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error en recuperación:", error);

    let errorMessage = "No se pudo procesar la solicitud";

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;

      if (errorData?.message) {
        errorMessage = errorData.message;

        // Mensajes amigables para errores específicos
        if (errorData.message.includes("no encontrado")) {
          errorMessage =
            "No hay ninguna cuenta registrada con este correo electrónico";
        }
      }
    }

    if (toastFn?.error) {
      toastFn.error("Error de recuperación", errorMessage);
    }

    throw error;
  }
}

export async function verifySecretWord(
  data: { email: string; secretWord: string },
  toastFn?: ToastFunctions
) {
  try {
    if (toastFn?.info) {
      toastFn.info("Verificando", "Comprobando palabra secreta...");
    }

    const response = await api.post("/verify-keyword", data);
    console.log(
      "📢 Verificación de palabra secreta:",
      JSON.stringify(response.data, null, 2)
    );

    if (toastFn?.success) {
      toastFn.success(
        "Palabra secreta correcta",
        "Ahora puedes restablecer tu contraseña"
      );
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error en verificación de palabra secreta:", error);

    let errorMessage = "No se pudo verificar la palabra secreta";

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;

      if (errorData?.message) {
        errorMessage = errorData.message;

        // Manejar errores específicos
        if (errorData.message.includes("incorrecta")) {
          errorMessage = "La palabra secreta introducida es incorrecta";
        } else if (errorData.message.includes("no existe")) {
          errorMessage =
            "No hay ninguna cuenta registrada con este correo electrónico";
        }
      }
    }

    if (toastFn?.error) {
      toastFn.error("Error de verificación", errorMessage);
    }

    throw error;
  }
}

export async function resetPassword(
  data: { token: string; newPassword: string },
  toastFn?: ToastFunctions
) {
  try {
    // Validar nueva contraseña
    const passwordValidation = ValidationService.validatePassword(
      data.newPassword
    );
    if (!passwordValidation.valid) {
      if (toastFn?.error) {
        toastFn.error("Contraseña inválida", passwordValidation.message!);
      }
      throw new Error(passwordValidation.message);
    }

    if (toastFn?.info) {
      toastFn.info("Procesando", "Actualizando tu contraseña...");
    }

    const response = await api.post("/reset-password", data);
    console.log(
      "📢 Restablecimiento de contraseña:",
      JSON.stringify(response.data, null, 2)
    );

    if (toastFn?.success) {
      toastFn.success(
        "¡Contraseña actualizada!",
        "Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión con tu nueva contraseña."
      );
    }

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Error en restablecimiento de contraseña:", error);

    let errorMessage = "No se pudo restablecer la contraseña";

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorData = axiosError.response?.data;

      if (errorData?.message) {
        errorMessage = errorData.message;

        if (
          errorData.message.includes("token") &&
          errorData.message.includes("inválido")
        ) {
          errorMessage =
            "El enlace de restablecimiento ha expirado o no es válido. Solicita uno nuevo.";
        }
      }
    }

    if (toastFn?.error) {
      toastFn.error("Error de restablecimiento", errorMessage);
    }

    throw error;
  }
}
