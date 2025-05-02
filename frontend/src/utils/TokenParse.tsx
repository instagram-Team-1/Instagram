// utils/auth.ts
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
}

export const getUserIdFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
