"use client";

import {
  useGetPermissionsQuery,
  useUpdatePermissionMutation,
} from "@/services/permissionApi";
import { Role, RoutePermission } from "@/types/permission";
import { message } from "antd";
import { useMemo } from "react";

const ALL_ROLES: Role[] = ["public", "viewer", "editor", "admin"];

const ROLE_COLORS: Record<Role, string> = {
  public: "bg-gray-100 text-gray-600 border-gray-300",
  viewer: "bg-blue-50 text-blue-600 border-blue-300",
  editor: "bg-yellow-50 text-yellow-700 border-yellow-300",
  admin: "bg-red-50 text-red-600 border-red-300",
};

const ACTION_LABELS: Record<string, string> = {
  list: "List",
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
};

const RoleToggle = ({
  role,
  active,
  onToggle,
}: {
  role: Role;
  active: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className={`px-2 py-0.5 rounded border text-xs font-medium transition-opacity cursor-pointer ${
      ROLE_COLORS[role]
    } ${active ? "opacity-100" : "opacity-25"}`}
  >
    {role}
  </button>
);

const PermissionRow = ({ permission }: { permission: RoutePermission }) => {
  const [updatePermission, { isLoading }] = useUpdatePermissionMutation();

  const handleToggle = async (role: Role) => {
    const current = permission.allowedRoles;
    const next = current.includes(role)
      ? current.filter((r) => r !== role)
      : [...current, role];

    if (next.length === 0) {
      message.warning("At least one role must be allowed");
      return;
    }

    try {
      await updatePermission({ key: permission.key, allowedRoles: next }).unwrap();
    } catch {
      message.error("Failed to update permission");
    }
  };

  return (
    <tr className={isLoading ? "opacity-50" : ""}>
      <td className="border border-gray-200 px-3 py-2 font-mono text-xs text-gray-500">
        {permission.key}
      </td>
      <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">
        {permission.description}
      </td>
      <td className="border border-gray-200 px-3 py-2">
        <div className="flex gap-1.5 flex-wrap">
          {ALL_ROLES.map((role) => (
            <RoleToggle
              key={role}
              role={role}
              active={permission.allowedRoles.includes(role)}
              onToggle={() => handleToggle(role)}
            />
          ))}
        </div>
      </td>
    </tr>
  );
};

const PermissionsPage = () => {
  const { data, isLoading, isError } = useGetPermissionsQuery();

  const grouped = useMemo(() => {
    if (!data) return {};
    return data.reduce<Record<string, RoutePermission[]>>((acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = [];
      acc[p.resource].push(p);
      return acc;
    }, {});
  }, [data]);

  if (isLoading) return <p className="p-10">Loading...</p>;
  if (isError) return <p className="p-10">Error loading permissions</p>;

  return (
    <div className="p-10 text-black">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Click a role badge to toggle access for that endpoint.
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {ALL_ROLES.map((role) => (
          <span
            key={role}
            className={`px-2 py-0.5 rounded border text-xs font-medium ${ROLE_COLORS[role]}`}
          >
            {role}
          </span>
        ))}
        <span className="text-xs text-gray-400 self-center ml-1">
          — faded = no access
        </span>
      </div>

      <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([resource, permissions]) => (
          <div key={resource}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {resource}
            </h2>
            <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                  <th className="border border-gray-200 px-3 py-2 w-40">Key</th>
                  <th className="border border-gray-200 px-3 py-2">Description</th>
                  <th className="border border-gray-200 px-3 py-2 w-64">Allowed Roles</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((p) => (
                  <PermissionRow key={p.key} permission={p} />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionsPage;
