import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Rankings from "@/pages/Rankings";
import PlayerDetail from "@/pages/PlayerDetail";
import CircuitRankings from "@/pages/CircuitRankings";
import HighSchoolRankings from "@/pages/HighSchoolRankings";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPlayers from "@/pages/admin/Players";
import AdminHighSchools from "@/pages/admin/HighSchools";
import AdminCircuitTeams from "@/pages/admin/CircuitTeams";
import AdminColleges from "@/pages/admin/Colleges";
import AdminProducts from "@/pages/admin/Products";
import AdminUsers from "@/pages/admin/Users";
import NotFound from "@/pages/not-found";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-2 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="font-semibold">ASGR Admin Panel</div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/players" component={AdminPlayers} />
          <Route path="/admin/high-schools" component={AdminHighSchools} />
          <Route path="/admin/circuit-teams" component={AdminCircuitTeams} />
          <Route path="/admin/colleges" component={AdminColleges} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Events} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/profile" component={Profile} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/player/:id" component={PlayerDetail} />
      <Route path="/rankings" component={Rankings} />
      <Route path="/rankings/:year" component={Rankings} />
      <Route path="/rankings/circuit/:year" component={CircuitRankings} />
      <Route path="/rankings/circuit" component={CircuitRankings} />
      <Route path="/rankings/high-school/:season" component={HighSchoolRankings} />
      <Route path="/rankings/high-school" component={HighSchoolRankings} />
      <Route path="/cart" component={Cart} />
      <Route path="/contact" component={Contact} />
      <Route path="/events" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;