"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { useLogoutMutation } from "@/services/authApi";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { accessToken, refreshToken, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [logoutApi] = useLogoutMutation();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!isLoginPage && !accessToken) {
      router.replace("/login");
    }
  }, [accessToken, isLoginPage, router]);

  // Login page — render without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated yet — wait for redirect
  if (!accessToken) {
    return null;
  }

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutApi({ refreshToken }).unwrap();
      }
    } finally {
      dispatch(logout());
      router.replace("/login");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-44 h-screen sticky top-0 self-start bg-black text-white p-5 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Admin</h1>

        <nav className="flex flex-col gap-4 flex-1">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/magazines">Magazines</Link>
          <Link href="/authors">Authors</Link>
        </nav>

        {/* User info + logout */}
        <div className="border-t border-gray-700 pt-4">
          {user && (
            <>
              <p className="text-xs text-gray-400 truncate mb-1">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize mb-3">{user.role}</p>
            </>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
