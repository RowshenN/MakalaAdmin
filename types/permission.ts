export type Role = "public" | "viewer" | "editor" | "admin";
export type Action = "list" | "view" | "create" | "update" | "delete";

export interface RoutePermission {
  id: string;
  key: string;
  resource: string;
  action: Action;
  allowedRoles: Role[];
  description: string | null;
}
