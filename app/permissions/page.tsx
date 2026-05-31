"use client";

import {
  useGetPermissionsQuery,
  useUpdatePermissionMutation,
} from "@/services/permissionApi";
import { Role, RoutePermission } from "@/types/permission";
import { message } from "antd";
import { useEffect, useMemo, useState } from "react";

const ALL_ROLES: Role[] = ["public", "viewer", "editor", "admin"];

const ROLE_COLORS: Record<Role, string> = {
  public: "bg-gray-100 text-gray-600 border-gray-300",
  viewer: "bg-blue-50 text-blue-600 border-blue-300",
  editor: "bg-yellow-50 text-yellow-700 border-yellow-300",
  admin: "bg-red-50 text-red-600 border-red-300",
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

const PermissionRow = ({
  permission,
  allowedRoles,
  changed,
  onToggle,
}: {
  permission: RoutePermission;
  allowedRoles: Role[];
  changed: boolean;
  onToggle: (role: Role) => void;
}) => (
  <tr className={changed ? "bg-yellow-50/40" : ""}>
    <td className="border border-gray-200 px-3 py-2 font-mono text-xs text-gray-500">
      <div className="flex items-center gap-1.5">
        {changed && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />}
        {permission.key}
      </div>
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
            active={allowedRoles.includes(role)}
            onToggle={() => onToggle(role)}
          />
        ))}
      </div>
    </td>
  </tr>
);

const PermissionsPage = () => {
  const { data, isLoading, isError } = useGetPermissionsQuery();
  const [updatePermission] = useUpdatePermissionMutation();

  const [draft, setDraft] = useState<Record<string, Role[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      const initial: Record<string, Role[]> = {};
      data.forEach((p) => {
        initial[p.key] = [...p.allowedRoles];
      });
      setDraft(initial);
    }
  }, [data]);

  const changedKeys = useMemo(() => {
    if (!data) return [];
    return data
      .filter((p) => {
        const d = draft[p.key];
        if (!d) return false;
        return (
          [...p.allowedRoles].sort().join(",") !== [...d].sort().join(",")
        );
      })
      .map((p) => p.key);
  }, [data, draft]);

  const grouped = useMemo(() => {
    if (!data) return {};
    return data.reduce<Record<string, RoutePermission[]>>((acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = [];
      acc[p.resource].push(p);
      return acc;
    }, {});
  }, [data]);

  const toggleRole = (key: string, role: Role) => {
    setDraft((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role];
      if (next.length === 0) {
        message.warning("At least one role must be allowed");
        return prev;
      }
      return { ...prev, [key]: next };
    });
  };

  const handleSave = async () => {
    if (changedKeys.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        changedKeys.map((key) =>
          updatePermission({ key, allowedRoles: draft[key] }).unwrap()
        )
      );
      message.success(
        `Saved ${changedKeys.length} permission${changedKeys.length !== 1 ? "s" : ""}`
      );
    } catch {
      message.error("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!data) return;
    const initial: Record<string, Role[]> = {};
    data.forEach((p) => {
      initial[p.key] = [...p.allowedRoles];
    });
    setDraft(initial);
  };

  if (isLoading) return <p className="p-10">Loading...</p>;
  if (isError) return <p className="p-10">Error loading permissions</p>;

  return (
    <div className="p-10 text-black">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permissions</h1>
        </div>

        <div className="flex items-center gap-3">
          {changedKeys.length > 0 && (
            <span className="text-xs text-yellow-600 font-medium">
              {changedKeys.length} unsaved change{changedKeys.length !== 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={handleReset}
            disabled={changedKeys.length === 0 || saving}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={changedKeys.length === 0 || saving}
            className="px-4 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
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
                  <PermissionRow
                    key={p.key}
                    permission={p}
                    allowedRoles={draft[p.key] ?? p.allowedRoles}
                    changed={changedKeys.includes(p.key)}
                    onToggle={(role) => toggleRole(p.key, role)}
                  />
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
