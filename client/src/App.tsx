import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Events} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;