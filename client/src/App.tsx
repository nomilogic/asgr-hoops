import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

// Public pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ScoutingService from "@/pages/ScoutingService";
import MerchShop from "@/pages/MerchShop";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";

// Rankings (protected)
import Rankings from "@/pages/Rankings";
import PlayerDetail from "@/pages/PlayerDetail";
import CircuitRankings from "@/pages/CircuitRankings";
import HighSchoolRankings from "@/pages/HighSchoolRankings";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPlayers from "@/pages/admin/Players";
import AdminHighSchools from "@/pages/admin/HighSchools";
import AdminCircuitTeams from "@/pages/admin/CircuitTeams";
import AdminColleges from "@/pages/admin/Colleges";
import AdminProducts from "@/pages/admin/Products";
import AdminUsers from "@/pages/admin/Users";

import NotFound from "@/pages/not-found";


// -----------------------
// Protected Route Wrapper
// -----------------------
function ProtectedRoute({ component: Component }: { component: any }) {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}


// -----------------------
// Admin Layout
// -----------------------
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
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}


// -----------------------
// Main Router
// -----------------------
function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <AdminLayout>
        <Switch>
          <Route
            path="/admin"
            component={() => <ProtectedRoute component={AdminDashboard} />}
          />
          <Route
            path="/admin/players"
            component={() => <ProtectedRoute component={AdminPlayers} />}
          />
          <Route
            path="/admin/high-schools"
            component={() => <ProtectedRoute component={AdminHighSchools} />}
          />
          <Route
            path="/admin/circuit-teams"
            component={() => <ProtectedRoute component={AdminCircuitTeams} />}
          />
          <Route
            path="/admin/colleges"
            component={() => <ProtectedRoute component={AdminColleges} />}
          />
          <Route
            path="/admin/products"
            component={() => <ProtectedRoute component={AdminProducts} />}
          />
          <Route
            path="/admin/users"
            component={() => <ProtectedRoute component={AdminUsers} />}
          />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/profile" component={Profile} />
      <Route path="/scouting-service" component={ScoutingService} />
      <Route path="/merch" component={MerchShop} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/player/:id" component={PlayerDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/contact" component={Contact} />
      <Route path="/events" component={Events} />

      {/* Protected Rankings */}
      <Route
        path="/rankings"
        component={() => <ProtectedRoute component={Rankings} />}
      />
      <Route
        path="/rankings/:year"
        component={() => <ProtectedRoute component={Rankings} />}
      />
      <Route
        path="/rankings/circuit"
        component={() => <ProtectedRoute component={CircuitRankings} />}
      />
      <Route
        path="/rankings/circuit/:year"
        component={() => <ProtectedRoute component={CircuitRankings} />}
      />
      <Route
        path="/rankings/high-school"
        component={() => <ProtectedRoute component={HighSchoolRankings} />}
      />
      <Route
        path="/rankings/high-school/:season"
        component={() => <ProtectedRoute component={HighSchoolRankings} />}
      />

      <Route component={NotFound} />
    </Switch>
  );
}


// -----------------------
// App Component
// -----------------------
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
