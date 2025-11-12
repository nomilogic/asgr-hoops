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
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Type definitions
interface Player {
  id: number;
  name: string;
  ranks?: Record<string, number>;
}

interface HighSchool {
  id: number;
  name: string;
  ranks?: Record<string, number>;
}

interface CircuitTeam {
  id: number;
  name: string;
  ranks?: Record<string, number>;
}

interface CartItem {
  id: number;
  quantity: number;
}

type NavItem = {
  label: string;
  href: string;
  testid: string;
} | {
  label: string;
  dropdown: Array<{ label: string; href: string; testid: string }>;
  dropdownTitle: string;
  dropdownWidth: string;
  testid: string;
};

const logoImage = "/attached_assets/asgr_basketball.png";

const staticNavConfig = [
  {
    label: "Home",
    href: "/",
    testid: "link-home",
  },
  {
    label: "Scouting Service",
    href: "/products",
    testid: "link-products",
  },
  {
    label: "Events",
    href: "/events",
    testid: "link-events",
  },
  {
    label: "Contact",
    href: "/contact",
    testid: "link-contact",
  },
] as const;

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cart } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const { data: players } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const { data: highSchools } = useQuery<HighSchool[]>({
    queryKey: ["/api/high-schools"],
  });

  const { data: circuitTeams } = useQuery<CircuitTeam[]>({
    queryKey: ["/api/circuit-teams"],
  });

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Extract available years for Player Rankings
  const playerYears = useMemo(() => {
    if (!players) return [];
    const years = new Set<string>();
    players.forEach((player) => {
      if (player.ranks) {
        Object.keys(player.ranks).forEach((key) => {
          const year = parseInt(key);
          if (!isNaN(year)) {
            years.add(year.toString());
          }
        });
      }
    });
    return Array.from(years).sort().map((year) => ({
      label: `Class ${year}`,
      href: `/rankings/${year}`,
      testid: `link-rankings-${year}`,
    }));
  }, [players]);

  // Extract available seasons for High School Rankings
  const hsSeasons = useMemo(() => {
    if (!highSchools) return [];
    const seasons = new Set<string>();
    highSchools.forEach((school) => {
      if (school.ranks) {
        Object.keys(school.ranks).forEach((season) => {
          seasons.add(season);
        });
      }
    });
    return Array.from(seasons).sort().reverse().map((season) => ({
      label: season,
      href: `/rankings/high-school/${season}`,
      testid: `link-hs-${season.replace(/\s+/g, "-").toLowerCase()}`,
    }));
  }, [highSchools]);

  // Extract available seasons for Circuit Rankings
  const circuitSeasons = useMemo(() => {
    if (!circuitTeams) return [];
    const seasons = new Set<string>();
    circuitTeams.forEach((team) => {
      if (team.ranks) {
        Object.keys(team.ranks).forEach((season) => {
          seasons.add(season);
        });
      }
    });
    return Array.from(seasons).sort().reverse().map((season) => {
      const year = season.match(/\d{4}/)?.[0] || "";
      return {
        label: season,
        href: `/rankings/circuit/${year}`,
        testid: `link-circuit-${year}`,
      };
    });
  }, [circuitTeams]);

  // Build dynamic navigation config
  const navConfig = useMemo(() => {
    const dynamicNav = [...staticNavConfig];
    
    // Insert dynamic dropdowns before Events and Contact
    const insertIndex = dynamicNav.findIndex(item => item.label === "Events");
    
    const dynamicItems: NavItem[] = [];
    
    if (playerYears.length > 0) {
      dynamicItems.push({
        label: "Player Rankings",
        dropdown: playerYears,
        testid: "button-rankings-menu",
        dropdownTitle: "Top 350 Rankings",
        dropdownWidth: "w-[280px]",
      });
    }

    if (hsSeasons.length > 0) {
      dynamicItems.push({
        label: "High School Rankings",
        dropdown: hsSeasons,
        testid: "button-high-school-menu",
        dropdownTitle: "By Season",
        dropdownWidth: "w-[260px]",
      });
    }

    if (circuitSeasons.length > 0) {
      dynamicItems.push({
        label: "Circuit Rankings",
        dropdown: circuitSeasons,
        testid: "button-circuit-menu",
        dropdownTitle: "By Season",
        dropdownWidth: "w-[260px]",
      });
    }

    return [
      ...dynamicNav.slice(0, insertIndex),
      ...dynamicItems,
      ...dynamicNav.slice(insertIndex),
    ] as NavItem[];
  }, [playerYears, hsSeasons, circuitSeasons]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-900/30 bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95 shadow-lg shadow-red-900/10 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 animate-fade-in">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md group transition-all duration-300"
            data-testid="link-home"
          >
            <img
              src={logoImage}
              alt="ASGR Basketball"
              className="h-10 w-auto group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all duration-300"
            />
            <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              ASGR Basketball
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navConfig.map((item) => {
              const isDropdown = 'dropdown' in item;
              return isDropdown ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 text-sm font-medium rounded-md hover:text-red-500 transition-colors duration-300 flex items-center gap-1 hover-elevate active-elevate-2">
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <div className="px-3 py-2 text-xs font-bold text-red-500 uppercase tracking-wide border-b border-border/50 mb-1">
                      {item.dropdownTitle}
                    </div>
                    {item.dropdown.map((sub) => (
                      <DropdownMenuItem key={sub.label} asChild>
                        <Link
                          href={sub.href}
                          className="block px-3 py-2.5 text-sm font-medium rounded-md hover-elevate active-elevate-2 transition-all duration-200 hover:bg-red-900/20 hover:text-red-400 cursor-pointer"
                          data-testid={sub.testid}
                        >
                          {sub.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                    location === item.href
                      ? "bg-secondary text-secondary-foreground"
                      : "text-foreground"
                  }`}
                  data-testid={item.testid}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 h-9 w-9"
            data-testid="link-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                data-testid="badge-cart-count"
              >
                {cartCount}
              </Badge>
            )}
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6 flex-1 overflow-y-auto">
                {navConfig.map((item) => {
                  const isDropdown = 'dropdown' in item;
                  return isDropdown ? (
                    <Collapsible key={item.label} className="space-y-2">
                      <CollapsibleTrigger className="px-3 py-2 text-sm font-semibold text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors w-full">
                        {item.label}
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 flex flex-col gap-2 space-y-0">
                        <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/70">{item.dropdownTitle}</div>
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className={`px-3 py-2 text-sm rounded-md hover-elevate active-elevate-2 ${
                              location === sub.href
                                ? "bg-secondary text-secondary-foreground"
                                : "text-foreground"
                            }`}
                            onClick={() => setMobileOpen(false)}
                            data-testid={sub.testid}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md hover-elevate active-elevate-2 ${
                        location === item.href
                          ? "bg-secondary text-secondary-foreground"
                          : "text-foreground"
                      }`}
                      onClick={() => setMobileOpen(false)}
                      data-testid={item.testid}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}