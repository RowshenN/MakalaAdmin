"use client";

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/services/userApi";
import { UserRole } from "@/types/user";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Modal, message, Select } from "antd";
import { useState } from "react";

const ROLES: UserRole[] = ["admin", "editor", "viewer"];

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-red-50 text-red-600 border-red-300",
  editor: "bg-yellow-50 text-yellow-700 border-yellow-300",
  viewer: "bg-blue-50 text-blue-600 border-blue-300",
};

const emptyForm = { email: "", password: "", name: "", role: "viewer" as UserRole };

const UsersPage = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await updateUser({ id: userId, role }).unwrap();
      message.success("Role updated");
    } catch {
      message.error("Failed to update role");
    }
  };

  const handleDelete = (userId: string, email: string) => {
    Modal.confirm({
      title: `Delete user "${email}"?`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteUser(userId).unwrap();
          message.success("User deleted");
        } catch {
          message.error("Failed to delete user");
        }
      },
    });
  };

  const handleCreate = async () => {
    if (!form.email || !form.password) {
      message.warning("Email and password are required");
      return;
    }

    setSubmitting(true);
    try {
      await createUser({
        email: form.email,
        password: form.password,
        name: form.name || undefined,
        role: form.role,
      }).unwrap();
      message.success("User created");
      setModalOpen(false);
      setForm(emptyForm);
    } catch {
      message.error("Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <p className="p-10">Loading...</p>;
  if (isError) return <p className="p-10">Error loading users</p>;

  return (
    <div className="p-10 text-black">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user accounts and roles.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 cursor-pointer"
        >
          + New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="border-b border-gray-200 px-4 py-3">Name</th>
              <th className="border-b border-gray-200 px-4 py-3">Email</th>
              <th className="border-b border-gray-200 px-4 py-3 w-36">Role</th>
              <th className="border-b border-gray-200 px-4 py-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {user.name ?? <span className="text-gray-400 italic">—</span>}
                  {user.id === currentUserId && (
                    <span className="ml-2 text-xs text-gray-400">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{user.email}</td>
                <td className="px-4 py-3">
                  {user.id === currentUserId ? (
                    <span
                      className={`px-2 py-0.5 rounded border text-xs font-medium ${ROLE_COLORS[user.role]}`}
                    >
                      {user.role}
                    </span>
                  ) : (
                    <Select
                      value={user.role}
                      size="small"
                      style={{ width: 110 }}
                      onChange={(val) => handleRoleChange(user.id, val as UserRole)}
                      options={ROLES.map((r) => ({ value: r, label: r }))}
                    />
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Create New User"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setForm(emptyForm); }}
        onOk={handleCreate}
        okText="Create"
        confirmLoading={submitting}
      >
        <div className="flex flex-col gap-3 mt-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
              placeholder="min. 8 characters"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
              placeholder="Full name (optional)"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Role</label>
            <Select
              value={form.role}
              style={{ width: "100%" }}
              onChange={(val) => setForm((f) => ({ ...f, role: val as UserRole }))}
              options={ROLES.map((r) => ({ value: r, label: r }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
