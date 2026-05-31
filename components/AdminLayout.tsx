import Link from "next/link";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-44 h-screen sticky top-0 self-start bg-black text-white p-5">
        <h1 className="text-2xl font-bold mb-8">Admin</h1>

        <nav className="flex flex-col gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/magazines">Magazines</Link>
          <Link href="/authors">Authors</Link>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 w-full bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
