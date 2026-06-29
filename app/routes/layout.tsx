import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="p-8">
      <header className="border p-8 mb-8 rounded-xl bg-card">
        <h1 className="text-3xl">Dynamic Form Builder</h1>
      </header>
      <main className="px-8">
        <Outlet />
      </main>
    </div>
  );
}
