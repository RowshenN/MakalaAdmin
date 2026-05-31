const DashboardPage = () => {
  return (
    <div className="p-10 text-black ">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="mt-6 grid grid-cols-5 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold">Issues</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold">Articles</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold">Categories</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold">Magazines</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-lg font-semibold">Authors</h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
