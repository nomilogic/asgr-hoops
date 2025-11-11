import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProspectCard } from "@/components/ProspectCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, Player } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Users, BarChart3 } from "lucide-react";
import { useMemo } from "react";

export default function Events() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: players2024, isLoading: isLoading2024 } = useQuery<Player[]>({
    queryKey: ["/api/players/year", 2024],
  });

  const { data: players2025, isLoading: isLoading2025 } = useQuery<Player[]>({
    queryKey: ["/api/players/year", 2025],
  });

  const topProspects = useMemo(() => {
    const top2024 = (players2024 || [])
      .filter(p => p.rank !== null && p.rank !== undefined)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0))
      .slice(0, 5);

    const top2025 = (players2025 || [])
      .filter(p => p.rank !== null && p.rank !== undefined)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0))
      .slice(0, 5);

    return [...top2024, ...top2025];
  }, [players2024, players2025]);

  const isLoadingProspects = isLoading2024 || isLoading2025;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-black via-red-950/20 to-black py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent"
                data-testid="text-hero-title"
              >
                Elite Basketball Scouting Services
              </h1>
              <p
                className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in animation-delay-200"
                data-testid="text-hero-subtitle"
              >
                Comprehensive coverage of the nation's top high school
                basketball talent. Subscribe to get access to detailed player
                rankings, analysis, and scouting reports.
              </p>
              <div className="flex gap-4 justify-center flex-wrap animate-scale-in animation-delay-400">
                <Link href="/products" asChild>
                  <Button
                    size="lg"
                    variant="default"
                    className="animate-pulse-glow hover:scale-105 transition-transform duration-300"
                    data-testid="button-view-packages"
                  >
                    View Packages
                  </Button>
                </Link>
                <Link href="/rankings/top350/2025" asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-red-600 hover:bg-red-950 hover:scale-105 transition-all duration-300"
                    data-testid="button-view-rankings"
                  >
                    View Rankings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-black to-red-950/10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group animate-slide-in-left hover:scale-105 transition-all duration-300">
                <div className="bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700/30 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300">
                  <Trophy className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-red-400">
                  Top 350 Rankings
                </h3>
                <p className="text-sm text-gray-400">
                  Comprehensive rankings of the nation's best high school
                  basketball players across multiple graduating classes
                </p>
              </div>
              <div className="text-center group animate-fade-in animation-delay-200 hover:scale-105 transition-all duration-300">
                <div className="bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700/30 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300">
                  <Users className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-red-400">
                  Expert Analysis
                </h3>
                <p className="text-sm text-gray-400">
                  Detailed scouting reports and analysis from experienced
                  basketball scouts and analysts
                </p>
              </div>
              <div className="text-center group animate-slide-in-right animation-delay-400 hover:scale-105 transition-all duration-300">
                <div className="bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700/30 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-red-400">
                  Regional Coverage
                </h3>
                <p className="text-sm text-gray-400">
                  Coverage of regional talent including Carolinas, DMV, Peach
                  State, Sunshine State, Lone Star, and California
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-red-950/10 to-black">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Featured Top Prospects
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Discover the nation's elite high school basketball talent
              </p>
            </div>

            {isLoadingProspects ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {topProspects.map((player) => (
                  <ProspectCard
                    key={player.id}
                    player={player}
                    displayRank={player.rank || 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                data-testid="text-packages-title"
              >
                Scouting Service Packages
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the package that fits your needs. Get access to exclusive
                player rankings, detailed analysis, and comprehensive scouting
                reports.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
