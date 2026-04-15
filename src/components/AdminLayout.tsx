import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card/95 backdrop-blur-md px-4 gap-3 sticky top-0 z-40">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-extrabold text-xs">P</span>
              </div>
              <span className="font-bold text-foreground text-sm">
                Parking<span className="text-primary">Togo</span>
                <span className="text-muted-foreground font-normal ml-1.5 text-xs">Admin</span>
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
