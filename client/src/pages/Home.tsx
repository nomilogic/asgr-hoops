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
import womanBasketTitle from "../assets/generated/woman_basket_title.png";
import landingPageHeader from "../assets/generated/Landing-page-header.jpg";

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
    <div className="min-h-screen w-screen  ">
      <Header />

      <main className="flex w-full flex-col">
        <section className="relative bg-gradient-to-br from-black via-red-950/20 to-black overflow-hidden w-full">
          <div className="absolute inset-0 w-full h-full">
            <img
              src={landingPageHeader}
              alt=""
              className="w-full h-full object-cover object-center opacity-40"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black"></div>
          </div>

          <div className="absolute w-full top-0">
            <img
              src={basketGirl}
              alt=""
              className="w-full object-cover object-center opacity-70"
              aria-hidden="true"
            />
          </div>

          <div className="container max-w-full relative z-10 bg-black/70 p-10 m-0 flex items-center flex-col lg:flex-row">
            <div className="w-[50%] justify-center flex">
              <div className="justify-center ">
                <img
                  src={asgrLogo}
                  alt="ASGR Basketball Logo"
                  className="w-60 object-contain object-center"
                  aria-hidden="true"
                />
              </div>

              <div className="flex   mb-8 ">
                <img
                  src={womanBasketTitle}
                  alt="Women's Basketball Recruiting"
                  className="w-80   h-auto object-contain"
                />
              </div>
            </div>
            <div className="text-center mx-auto w-[100%] md:w-[50%]">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent"
                data-testid="text-hero-title"
              >
                Where College Coaches & Players Connect
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
                <Link href="/rankings/2025/" asChild>
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

        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                A Proven Path for Number 1 Ranked Talent and Rising Stars
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                ASGR-ranked players have committed to the nation's top basketball programs
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                <div 
                  key={num} 
                  className="group flex items-center justify-center p-4 rounded-lg bg-card border border-border hover-elevate transition-all duration-300"
                  data-testid={`badge-college-${num}`}
                >
                  <img
                    src={`/attached_assets/New Homepage _ ASGR Hoops_files/badge_${num}.jpg`}
                    alt={`College Badge ${num}`}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                Recruiting Service
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-8 hover-elevate">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                    ASGR Basketball is a customized version recruiting service specifically built for All Star Girls Report.
                  </h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      The unequaled, in-depth player evaluations from the All Star Girls Report produced by longtime analyst Michael T. White will evaluate over 2,500 prospects at the High School, Transfer Portal, Juco 150, International and Middle School levels each year.
                    </p>
                    <p>
                      The service that revolutionized women's basketball over the past several decades simply gets better and better. Beginning June 1, 2025 through May 31, 2026, get our ASGR database Today!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-xl p-8 hover-elevate">
                <h4 className="text-xl font-bold mb-4 text-red-500">Exclusive ASGR Database Features</h4>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Access our unequaled, in-depth scouting data. The database allows your staff to stay up-to-date with our inside information on national evaluations, player ratings and rankings, key interviews of prospects around the country.
                  </p>
                  <p>
                    All the latest projections from the recruiting trail will be available with consistent reports on the ASGR database from major non and live viewing period events. Find all the recruiting needs with one, quick mobile stop.
                  </p>
                  <p>
                    The ASGR database can give daily and weekly updates on current prospects that best fit your college system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                ASGR Rating System
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                Understanding our comprehensive player evaluation framework
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full mt-6"></div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-950/20 to-red-900/10 border-2 border-red-500/30 rounded-xl p-8 hover-elevate transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-block bg-red-500/10 border-2 border-red-500 rounded-lg px-6 py-3">
                      <h3 className="text-3xl md:text-4xl font-bold text-red-500">98-100</h3>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-lg font-semibold">Future WNBA draft pick | WNBA Draft Projection</p>
                    <img
                      src="/attached_assets/New Homepage _ ASGR Hoops_files/WNBA_logo.jpg"
                      alt="WNBA Logo"
                      className="w-48 h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card border-2 border-border rounded-xl p-8 hover-elevate transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-block bg-primary/10 border-2 border-primary rounded-lg px-6 py-3">
                      <h3 className="text-3xl md:text-4xl font-bold text-primary">93-97</h3>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-lg font-semibold text-muted-foreground">High Major Starter That can be an impact Player at:</p>
                    <img
                      src="/attached_assets/New Homepage _ ASGR Hoops_files/logo_phase2.jpg"
                      alt="High Major Colleges"
                      className="w-full max-w-3xl h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card border-2 border-border rounded-xl p-8 hover-elevate transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-block bg-primary/10 border-2 border-primary rounded-lg px-6 py-3">
                      <h3 className="text-3xl md:text-4xl font-bold text-primary">91-92</h3>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-lg font-semibold text-muted-foreground">Mid Major Starter That can be an impact Player at:</p>
                    <img
                      src="/attached_assets/New Homepage _ ASGR Hoops_files/logo_phase3.jpg"
                      alt="Mid Major Colleges"
                      className="w-full max-w-3xl h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card border-2 border-border rounded-xl p-8 hover-elevate transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center md:text-left">
                    <div className="inline-block bg-primary/10 border-2 border-primary rounded-lg px-6 py-3">
                      <h3 className="text-3xl md:text-4xl font-bold text-primary">90</h3>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-lg font-semibold text-muted-foreground">Division 2 or 3 Starter or Role Player</p>
                    <img
                      src="/attached_assets/New Homepage _ ASGR Hoops_files/logo_phase4.jpg"
                      alt="Division 2 and 3 Colleges"
                      className="w-64 h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
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
