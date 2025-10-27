import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Trophy, Users, BarChart3 } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-accent/10 to-background py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
                Elite Basketball Scouting Services
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8" data-testid="text-hero-subtitle">
                Comprehensive coverage of the nation's top high school basketball talent.
                Subscribe to get access to detailed player rankings, analysis, and scouting reports.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/products" asChild>
                  <Button size="lg" variant="default" data-testid="button-view-packages">
                    View Packages
                  </Button>
                </Link>
                <Link href="/rankings/2025" asChild>
                  <Button size="lg" variant="outline" data-testid="button-view-rankings">
                    View Rankings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Top 350 Rankings</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive rankings of the nation's best high school basketball players across multiple graduating classes
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Expert Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed scouting reports and analysis from experienced basketball scouts and analysts
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Regional Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Coverage of regional talent including Carolinas, DMV, Peach State, Sunshine State, Lone Star, and California
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-packages-title">
                Scouting Service Packages
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the package that fits your needs. Get access to exclusive player rankings,
                detailed analysis, and comprehensive scouting reports.
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
