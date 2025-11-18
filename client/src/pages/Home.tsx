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
import asgrLogo from "../assets/generated/asgr_basketball.png";
import basketGirl from "../assets/generated/Basketball_action_hero_image_c877a801.png";
import recruitingHeader from "../assets/generated/womens_basketball_recruiting.png";

export default function Home() {
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
      .map((p) => ({ ...p, displayRank: p.ranks?.["2024"] || p.rank }))
      .filter((p) => p.displayRank !== null && p.displayRank !== undefined)
      .sort((a, b) => (a.displayRank || 0) - (b.displayRank || 0))
      .slice(0, 3);

    const top2025 = (players2025 || [])
      .map((p) => ({ ...p, displayRank: p.ranks?.["2025"] || p.rank }))
      .filter((p) => p.displayRank !== null && p.displayRank !== undefined)
      .sort((a, b) => (a.displayRank || 0) - (b.displayRank || 0))
      .slice(0, 5);

    return [...top2024, ...top2025];
  }, [players2024, players2025]);

  const isLoadingProspects = isLoading2024 || isLoading2025;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative bg-black overflow-hidden">
          <div className="container max-w-full relative">
            <div className="w-full">
              <img
                src={recruitingHeader}
                alt="Women's Basketball Recruiting"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="text-center max-w-3xl mx-auto py-8 px-4">
              <p
                className="text-lg md:text-xl text-gray-300 mb-8"
                data-testid="text-hero-subtitle"
              >
                Comprehensive coverage of the nation's top high school
                basketball talent. Subscribe to get access to detailed player
                rankings, analysis, and scouting reports.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/products" asChild>
                  <Button
                    size="lg"
                    variant="default"
                    className="hover:scale-105 transition-transform duration-300"
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
                  Top 750 Rankings
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
                  National Coverage
                </h3>
                <p className="text-sm text-gray-400">
                  Coverage of Carolinas, DMV, Peach State, Sunshine State, Lone
                  Star, SoCal, NorCal, Mid-Atlantic, Rocky Mountains and
                  Heartland
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
              <div className="max-w-5xl mx-auto space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-red-400">
                    Class of 2024
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="aspect-[3/4] w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full mx-auto space-y-8">
                {players2025 && players2025.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-red-400">
                      Class of 2025
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {topProspects
                        .filter((p) => p.gradeYear === 2025)
                        .map((player) => (
                          <ProspectCard
                            key={player.id}
                            player={player}
                            displayRank={player.displayRank || 0}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-1"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {products
                  ?.sort((a, b) => b.price - a.price)
                  .map((product) => (
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
