import { Home, Users, Trophy, School, Star, Package, UserCog } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Players",
    url: "/admin/players",
    icon: Users,
  },
  {
    title: "High Schools",
    url: "/admin/high-schools",
    icon: School,
  },
  {
    title: "Circuit Teams",
    url: "/admin/circuit-teams",
    icon: Trophy,
  },
  {
    title: "Colleges",
    url: "/admin/colleges",
    icon: Star,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: UserCog,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar data-testid="sidebar-admin">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
