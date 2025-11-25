export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return 'Phone number is required';
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    return 'Phone number must be at least 10 digits';
  }

  if (digitsOnly.length > 15) {
    return 'Phone number is too long';
  }

  return null;
};

export const validateFullName = (name: string): string | null => {
  if (!name) {
    return 'Full name is required';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (name.trim().length > 100) {
    return 'Name is too long';
  }

  return null;
};

export const validateEducation = (education: string): string | null => {
  if (!education) {
    return 'Education/Profession is required';
  }

  if (education.trim().length < 2) {
    return 'Please provide more details';
  }

  return null;
};

export const validateMessage = (message: string): string | null => {
  if (!message) {
    return 'Message is required';
  }

  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters';
  }

  if (message.trim().length > 1000) {
    return 'Message is too long (max 1000 characters)';
  }

  return null;
};

export const validateSource = (source: string): string | null => {
  if (!source) {
    return 'Please select how you heard about us';
  }

  return null;
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US-style or keep as is for international
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  return phone;
};
