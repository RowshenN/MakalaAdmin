import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "./baseQuery";
import { RoutePermission, Role } from "@/types/permission";

export const permissionApi = createApi({
  reducerPath: "permissionApi",
  baseQuery: createBaseQueryWithReauth(""),
  tagTypes: ["Permission"],
  endpoints: (builder) => ({
    getPermissions: builder.query<RoutePermission[], void>({
      query: () => "permissions",
      providesTags: ["Permission"],
    }),

    updatePermission: builder.mutation<
      { message: string; permission: RoutePermission },
      { key: string; allowedRoles: Role[] }
    >({
      query: ({ key, allowedRoles }) => ({
        url: `permissions/${key}`,
        method: "PUT",
        body: { allowedRoles },
      }),
      invalidatesTags: ["Permission"],
    }),
  }),
});

export const { useGetPermissionsQuery, useUpdatePermissionMutation } =
  permissionApi;
