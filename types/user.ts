export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt?: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
}
