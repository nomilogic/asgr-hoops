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
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import logoImage from "@assets/generated_images/ASGR_Basketball_logo_5cbeba91.png";
import { useQuery } from "@tanstack/react-query";
import type { CartItem } from "@shared/schema";

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cart } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md" data-testid="link-home">
              <img src={logoImage} alt="ASGR Basketball" className="h-10 w-auto" />
              <span className="font-bold text-lg hidden sm:inline">ASGR Basketball</span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <a className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                location === "/" ? "bg-secondary text-secondary-foreground" : "text-foreground"
              }`} data-testid="link-events">
                Events
              </a>
            </Link>
            
            <Link href="/products">
              <a className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                location === "/products" ? "bg-secondary text-secondary-foreground" : "text-foreground"
              }`} data-testid="link-products">
                Scouting Service
              </a>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium" data-testid="button-rankings-menu">
                    Player Rankings
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-2">
                        <Link href="/rankings/2025">
                          <a className="block px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2" data-testid="link-rankings-2025">
                            Top 350 High School Class 2025
                          </a>
                        </Link>
                        <Link href="/rankings/2026">
                          <a className="block px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2" data-testid="link-rankings-2026">
                            Top 350 High School Class 2026
                          </a>
                        </Link>
                        <Link href="/rankings/2027">
                          <a className="block px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2" data-testid="link-rankings-2027">
                            Top 350 High School Class 2027
                          </a>
                        </Link>
                        <Link href="/rankings/2028">
                          <a className="block px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2" data-testid="link-rankings-2028">
                            Top 350 High School Class 2028
                          </a>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/contact">
              <a className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                location === "/contact" ? "bg-secondary text-secondary-foreground" : "text-foreground"
              }`} data-testid="link-contact">
                Contact
              </a>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <a data-testid="link-cart">
              <div className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 h-9 w-9">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" data-testid="badge-cart-count">
                    {cartCount}
                  </Badge>
                )}
              </div>
            </a>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/">
                  <a className="px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2" onClick={() => setMobileOpen(false)} data-testid="mobile-link-events">
                    Events
                  </a>
                </Link>
                <Link href="/products">
                  <a className="px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2" onClick={() => setMobileOpen(false)} data-testid="mobile-link-products">
                    Scouting Service
                  </a>
                </Link>
                <div>
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Player Rankings</div>
                  <div className="ml-4 flex flex-col gap-2 mt-2">
                    <Link href="/rankings/2025">
                      <a className="px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2" onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2025">
                        Class 2025
                      </a>
                    </Link>
                    <Link href="/rankings/2026">
                      <a className="px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2" onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2026">
                        Class 2026
                      </a>
                    </Link>
                    <Link href="/rankings/2027">
                      <a className="px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2" onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2027">
                        Class 2027
                      </a>
                    </Link>
                    <Link href="/rankings/2028">
                      <a className="px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2" onClick={() => setMobileOpen(false)} data-testid="mobile-link-rankings-2028">
                        Class 2028
                      </a>
                    </Link>
                  </div>
                </div>
                <Link href="/contact">
                  <a className="px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2" onClick={() => setMobileOpen(false)} data-testid="mobile-link-contact">
                    Contact
                  </a>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
