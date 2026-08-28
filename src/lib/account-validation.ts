export function validateContact(name: string, phone: string, community: string) {
  const fullName = name.trim().replace(/\s+/g, " ");
  const contactPhone = phone.trim();
  if (fullName.length < 2 || fullName.length > 160) {
    throw new Error("Escribe tu nombre completo (entre 2 y 160 caracteres).");
  }
  if (
    contactPhone &&
    (!/^\+?[\d\s()-]+$/.test(contactPhone) ||
      contactPhone.replace(/\D/g, "").length < 7 ||
      contactPhone.replace(/\D/g, "").length > 15)
  ) {
    throw new Error("Revisa el teléfono o déjalo vacío. Incluye el indicativo del país.");
  }
  if (community.trim().length > 160) throw new Error("La comunidad admite hasta 160 caracteres.");
  return { fullName, contactPhone, community: community.trim() };
}

export function validateEmail(email: string, currentEmail: string) {
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error("Escribe un correo válido, sin espacios.");
  }
  if (normalized === currentEmail.trim().toLowerCase()) {
    throw new Error("Ese ya es tu correo actual.");
  }
  return normalized;
}

export function validatePassword(password: string, confirmation: string) {
  if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
    throw new Error("Usa al menos 8 caracteres y un máximo de 72 bytes.");
  }
  if (password === "acceso123")
    throw new Error("Elige una contraseña personal, diferente de la temporal.");
  if (password !== confirmation) throw new Error("Las contraseñas no coinciden.");
  return password;
}
