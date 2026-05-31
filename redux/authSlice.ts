import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "editor" | "viewer";
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const isBrowser = typeof window !== "undefined";

const loadFromStorage = (): AuthState => {
  if (!isBrowser) return { user: null, accessToken: null, refreshToken: null };
  return {
    user: JSON.parse(localStorage.getItem("auth_user") || "null"),
    accessToken: localStorage.getItem("auth_access_token"),
    refreshToken: localStorage.getItem("auth_refresh_token"),
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadFromStorage,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user?: AuthUser;
      }>
    ) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      if (user) state.user = user;

      if (isBrowser) {
        localStorage.setItem("auth_access_token", accessToken);
        localStorage.setItem("auth_refresh_token", refreshToken);
        if (user) localStorage.setItem("auth_user", JSON.stringify(user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      if (isBrowser) {
        localStorage.removeItem("auth_access_token");
        localStorage.removeItem("auth_refresh_token");
        localStorage.removeItem("auth_user");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
