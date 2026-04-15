import { BarChart3, Car, Wrench, ClipboardList, AlertTriangle, Home } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const adminLinks = [
  { title: "Tableau de bord", url: "/admin", icon: BarChart3 },
  { title: "Véhicules", url: "/admin/vehicules", icon: Car },
  { title: "Pièces", url: "/admin/pieces", icon: Wrench },
  { title: "Commandes", url: "/admin/commandes", icon: ClipboardList },
  { title: "Alertes", url: "/admin/alertes", icon: AlertTriangle },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            {!collapsed && "Administration"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className="hover:bg-muted/50 text-muted-foreground" activeClassName="">
                    <Home className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Retour au site</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
