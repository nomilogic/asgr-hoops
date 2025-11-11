import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, Database, TrendingUp, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  features?: string[];
  category?: string;
  slug: string;
}

export default function Products() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Image */}
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-16 px-4 border-b border-red-900/20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/attached_assets/Pasted-Recruiting-Features-ASGR-Hoops-is-a-customized-version-recruiting-service-specifically-built-for-Al-1762852129961_1762852129961.txt')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                THE <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">ART</span> OF
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                RECRUITING
              </h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-200">MICHAEL T. WHITE</h3>
                <p className="text-lg text-red-400 uppercase tracking-wide">Founder of All-Star Girls Report</p>
                <p className="text-gray-300 leading-relaxed">
                  ASGR Basketball and ASGR Hoops was established in 1995 is a full service Girls Basketball scouting, media and events company, hosting grassroots basketball events, scouting services and product placement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recruiting Features Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-black to-red-950/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Recruiting Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                ASGR Hoops is a customized version recruiting service specifically built for All Star Girls Report.
              </p>
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                The unequaled, in-depth player evaluations from the All Star Girls Report are produced by long time analyst Michael T. White will evaluate over 2,500 prospects at the High School, Transfer Portal, Juco 150, International and Middle School levels each year.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                The service that revolutionized women's basketball over the past several decade simply gets better and better. Beginning June 1, 2025 through May 31, 2026, get our ASGR database Today!
              </p>
            </div>

            {/* Database Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <Database className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Exclusive ASGR Database</h3>
                    <p className="text-sm text-muted-foreground">
                      Access our unequaled, in-depth scouting data with comprehensive player evaluations.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <TrendingUp className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Real-Time Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Stay up-to-date with inside information on national evaluations, player ratings and rankings.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <Users className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Recruiting Trail Reports</h3>
                    <p className="text-sm text-muted-foreground">
                      All the latest projections from major non and live viewing period events.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-red-950/20 to-black border-red-900/30 p-8 mb-12">
              <p className="text-gray-300 text-lg leading-relaxed">
                Find all the recruiting needs with one, quick mobile stop. The ASGR database can give daily and weekly updates on current prospects that best fit your college system.
              </p>
            </Card>
          </div>
        </section>

        {/* Rating System Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-red-950/20 to-black border-y border-red-900/20">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              ASGR RECRUITING RATING SYSTEM
            </h2>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-red-700/40 p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-red-600 text-white text-xl font-bold px-4 py-2 shrink-0">98-100</Badge>
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">WNBA All-Star</h3>
                    <p className="text-gray-300">Future WNBA All-Star Projection</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-red-700/30 p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-red-700 text-white text-xl font-bold px-4 py-2 shrink-0">93-97</Badge>
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">High Major Starters</h3>
                    <p className="text-gray-300">
                      Impact Player at the American, Big East, ACC, Atlantic 10, Big 12, Big Ten, Colonial, Conference USA, MAC, Missouri Valley, Mountain West, Pac 12, Sun Belt and SEC.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-red-700/20 p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-red-800 text-white text-xl font-bold px-4 py-2 shrink-0">89-92</Badge>
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">Marginal High Major to Mid Major Starters</h3>
                    <p className="text-gray-300">
                      Impact Player at the American East, Atlantic Sun, Big South, Big Sky, Big West, Horizon, MAAC, Mid Continent, Ohio Valley, Southern, Ivy, MEAC, Northeast, Summit, Southland, Patriot, SWAC, West Coast, WAC.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Service Packages */}
        <section className="py-16 px-4 bg-black">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Scouting Service Packages
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products?.map((product) => (
                  <Card 
                    key={product.id}
                    className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/50 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6 space-y-4">
                      {product.category && (
                        <Badge className="bg-red-900/30 text-red-400 border-red-700/50">
                          {product.category}
                        </Badge>
                      )}

                      <h3 className="text-2xl font-bold group-hover:text-red-400 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>

                      {product.features && product.features.length > 0 && (
                        <div className="space-y-2 py-4">
                          <p className="font-semibold text-sm uppercase tracking-wide text-red-400">Package Includes:</p>
                          <ul className="space-y-2">
                            {product.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-4 border-t border-card-border space-y-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-red-400">
                            ${product.price}
                          </span>
                          <span className="text-sm text-muted-foreground">per year</span>
                        </div>

                        <div className="space-y-2">
                          <Link href={`/products/${product.slug}`} asChild>
                            <Button 
                              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                              size="lg"
                            >
                              Pay By Credit Card
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            className="w-full border-red-700/50 hover:bg-red-900/20"
                            size="lg"
                          >
                            Pay by Check
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Card className="mt-12 bg-card/30 backdrop-blur-sm border-red-900/30 p-6">
              <p className="text-sm text-gray-400 text-center">
                *Credit cards accepted online. If you are making payment by check, please email us at{" "}
                <a href="mailto:info@asgrbasketball.com" className="text-red-400 hover:text-red-300 underline">
                  info@asgrbasketball.com
                </a>{" "}
                for invoice and W-9 form.
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}