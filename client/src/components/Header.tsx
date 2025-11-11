import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CartItem } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const logoImage = "/attached_assets/asgr_basketball.png";

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cart } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-900/30 bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95 shadow-lg shadow-red-900/10 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 animate-fade-in">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md group transition-all duration-300" data-testid="link-home">
            <img src={logoImage} alt="ASGR Basketball" className="h-10 w-auto group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all duration-300" />
            <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">ASGR Basketball</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
              location === "/" ? "bg-secondary text-secondary-foreground" : "text-foreground"
            }`} data-testid="link-home">
              Home
            </Link>

            <Link href="/products" className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
              location === "/products" ? "bg-secondary text-secondary-foreground" : "text-foreground"
            }`} data-testid="link-products">
              Scouting Service
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:text-red-500 transition-colors" data-testid="button-rankings-menu">
                    Player Rankings
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0">
                    <div className="w-[280px] p-3 bg-card border border-card-border rounded-lg shadow-xl">
                      <div className="grid gap-1">
                        <div className="px-3 py-2 text-xs font-bold text-red-500 uppercase tracking-wide border-b border-border/50 mb-1">Top 350 Rankings</div>
                        <Link href="/rankings/2024" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-rankings-2024">
                          Class 2024
                        </Link>
                        <Link href="/rankings/2025" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-rankings-2025">
                          Class 2025
                        </Link>
                        <Link href="/rankings/2026" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-rankings-2026">
                          Class 2026
                        </Link>
                        <Link href="/rankings/2027" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-rankings-2027">
                          Class 2027
                        </Link>
                        <Link href="/rankings/2028" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-rankings-2028">
                          Class 2028
                        </Link>
                        <Link href="/rankings/2029" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-rankings-2029">
                          Class 2029
                        </Link>
                        <Link href="/rankings/2030" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-rankings-2030">
                          Class 2030
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:text-red-500 transition-colors" data-testid="button-high-school-menu">
                    High School Rankings
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0">
                    <div className="w-[260px] p-3 bg-card border border-card-border rounded-lg shadow-xl">
                      <div className="grid gap-1">
                        <div className="px-3 py-2 text-xs font-bold text-red-500 uppercase tracking-wide border-b border-border/50 mb-1">By Season</div>
                        <Link href="/rankings/high-school/2023-24" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-hs-2023-24">
                          2023-24 Season
                        </Link>
                        <Link href="/rankings/high-school/2024-25" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-hs-2024-25">
                          2024-25 Season
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:text-red-500 transition-colors" data-testid="button-circuit-menu">
                    Circuit Rankings
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0">
                    <div className="w-[260px] p-3 bg-card border border-card-border rounded-lg shadow-xl">
                      <div className="grid gap-1">
                        <div className="px-3 py-2 text-xs font-bold text-red-500 uppercase tracking-wide border-b border-border/50 mb-1">By Season</div>
                        <Link href="/rankings/circuit/2024" className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400" data-testid="link-circuit-2024">
                          2024 Circuit Season
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/events" className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
              location === "/events" ? "bg-secondary text-secondary-foreground" : "text-foreground"
            }`} data-testid="link-events">
              Events
            </Link>

            <Link href="/contact" className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
              location === "/contact" ? "bg-secondary text-secondary-foreground" : "text-foreground"
            }`} data-testid="link-contact">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/cart" className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 h-9 w-9" data-testid="link-cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" data-testid="badge-cart-count">
                {cartCount}
              </Badge>
            )}
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                  location === "/" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-home">
                  Home
                </Link>
                <Link href="/products" className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                  location === "/products" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-products">
                  Scouting Service
                </Link>
                <div>
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Player Rankings</div>
                  <div className="ml-4 flex flex-col gap-2 mt-2">
                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/70">TOP 350</div>
                    <Link href="/rankings/2024" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/2024" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2024">
                      Class 2024
                    </Link>
                    <Link href="/rankings/2025" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/2025" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2025">
                      Class 2025
                    </Link>
                    <Link href="/rankings/2026" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/2026" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2026">
                      Class 2026
                    </Link>
                    <Link href="/rankings/2027" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/2027" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2027">
                      Class 2027
                    </Link>
                    <Link href="/rankings/2028" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/2028" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2028">
                      Class 2028
                    </Link>
                    <Link href="/rankings/2029" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/2029" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2029">
                      Class 2029
                    </Link>
                    <Link href="/rankings/2030" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/2030" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2030">
                      Class 2030
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">High School Rankings</div>
                  <div className="ml-4 flex flex-col gap-2 mt-2">
                    <Link href="/rankings/high-school/2023-24" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/high-school/2023-24" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-hs-2023-24">
                      2023-24 Season
                    </Link>
                    <Link href="/rankings/high-school/2024-25" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/high-school/2024-25" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-hs-2024-25">
                      2024-25 Season
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Circuit Rankings</div>
                  <div className="ml-4 flex flex-col gap-2 mt-2">
                    <Link href="/rankings/circuit/2024" className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                      location === "/rankings/circuit/2024" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                    }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-circuit-2024">
                      2024 Circuit Season
                    </Link>
                  </div>
                </div>
                <Link href="/events" className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                  location === "/events" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-events">
                  Events
                </Link>
                <Link href="/contact" className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                  location === "/contact" ? "bg-secondary text-secondary-foreground" : "text-foreground"
                }`} onClick={() => setMobileOpen(false)} data-testid="mobile-link-contact">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}