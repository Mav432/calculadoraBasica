/**
 * Reglas de validación para el formulario de registro
 */
export const ValidationRules = {
    // Reglas para contraseñas
    password: {
      minLength: 8,
      requiresUppercase: true,
      requiresLowercase: true,
      requiresNumber: true,
      requiresSpecial: true,
    },
    
    // Reglas para nombres y apellidos
    name: {
      minLength: 2,
      maxLength: 50,
    },
    
    // Reglas para correo electrónico
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    
    // Reglas para teléfono
    phone: {
      minLength: 10,
    },
    
    // Reglas para palabra secreta
    secretWord: {
      minLength: 4,
    },
  };
  
  /**
   * Servicio de validación para formularios
   */
  export const ValidationService = {
    /**
     * Valida una dirección de correo electrónico
     */
    validateEmail(email: string): { valid: boolean; message?: string } {
      if (!email || email.trim() === '') {
        return { valid: false, message: 'El correo electrónico es obligatorio' };
      }
      
      if (!ValidationRules.email.pattern.test(email)) {
        return { valid: false, message: 'Formato de correo electrónico inválido' };
      }
      
      return { valid: true };
    },
    
    /**
     * Valida una contraseña según las reglas definidas
     */
    validatePassword(password: string): { valid: boolean; message?: string } {
      if (!password) {
        return { valid: false, message: 'La contraseña es obligatoria' };
      }
      
      const rules = ValidationRules.password;
      
      if (password.length < rules.minLength) {
        return { valid: false, message: `La contraseña debe tener al menos ${rules.minLength} caracteres` };
      }
      
      if (rules.requiresUppercase && !/[A-Z]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
      }
      
      if (rules.requiresLowercase && !/[a-z]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos una letra minúscula' };
      }
      
      if (rules.requiresNumber && !/[0-9]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos un número' };
      }
      
      if (rules.requiresSpecial && !/[@$!%*?&]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos un carácter especial (@$!%*?&)' };
      }
      
      return { valid: true };
    },
    
    /**
     * Valida un nombre o apellido
     */
    validateName(name: string, fieldName: string): { valid: boolean; message?: string } {
      if (!name || name.trim() === '') {
        return { valid: false, message: `El campo ${fieldName} es obligatorio` };
      }
      
      const rules = ValidationRules.name;
      
      if (name.length < rules.minLength) {
        return { valid: false, message: `${fieldName} debe tener al menos ${rules.minLength} caracteres` };
      }
      
      if (name.length > rules.maxLength) {
        return { valid: false, message: `${fieldName} no debe exceder los ${rules.maxLength} caracteres` };
      }
      
      return { valid: true };
    },
    
    /**
     * Valida un número telefónico
     */
    validatePhone(phone: string): { valid: boolean; message?: string } {
      if (!phone || phone.trim() === '') {
        return { valid: false, message: 'El número telefónico es obligatorio' };
      }
      
      // Eliminar espacios y caracteres especiales para la validación
      const cleanPhone = phone.replace(/\s+|-|\(|\)/g, '');
      
      if (cleanPhone.length < ValidationRules.phone.minLength) {
        return { valid: false, message: `El número telefónico debe tener al menos ${ValidationRules.phone.minLength} dígitos` };
      }
      
      if (!/^\d+$/.test(cleanPhone)) {
        return { valid: false, message: 'El número telefónico solo debe contener dígitos' };
      }
      
      return { valid: true };
    },
    
    /**
     * Valida una palabra secreta
     */
    validateSecretWord(secretWord: string): { valid: boolean; message?: string } {
      if (!secretWord || secretWord.trim() === '') {
        return { valid: false, message: 'La palabra secreta es obligatoria' };
      }
      
      if (secretWord.length < ValidationRules.secretWord.minLength) {
        return { valid: false, message: `La palabra secreta debe tener al menos ${ValidationRules.secretWord.minLength} caracteres` };
      }
      
      return { valid: true };
    },
    
    /**
     * Valida todos los campos del formulario de registro
     */
    validateRegistrationForm(form: {
      email: string;
      password: string;
      realName: string;
      lastName: string;
      phoneNumber: string;
      secretWord: string;
    }): { valid: boolean; errors: string[] } {
      const errors: string[] = [];
      
      // Validar email
      const emailValidation = this.validateEmail(form.email);
      if (!emailValidation.valid) {
        errors.push(emailValidation.message!);
      }
      
      // Validar contraseña
      const passwordValidation = this.validatePassword(form.password);
      if (!passwordValidation.valid) {
        errors.push(passwordValidation.message!);
      }
      
      // Validar nombre
      const nameValidation = this.validateName(form.realName, 'Nombre');
      if (!nameValidation.valid) {
        errors.push(nameValidation.message!);
      }
      
      // Validar apellido
      const lastNameValidation = this.validateName(form.lastName, 'Apellido');
      if (!lastNameValidation.valid) {
        errors.push(lastNameValidation.message!);
      }
      
      // Validar teléfono
      const phoneValidation = this.validatePhone(form.phoneNumber);
      if (!phoneValidation.valid) {
        errors.push(phoneValidation.message!);
      }
      
      // Validar palabra secreta
      const secretValidation = this.validateSecretWord(form.secretWord);
      if (!secretValidation.valid) {
        errors.push(secretValidation.message!);
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    }
  };