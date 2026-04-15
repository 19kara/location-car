import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
