// utils/auth.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  username: string;
}

export const getUserIdFromToken = (
  token: string | null
): { id: string | null; username: string | null } | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: decoded.id || null,
      username: decoded.username || null,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
