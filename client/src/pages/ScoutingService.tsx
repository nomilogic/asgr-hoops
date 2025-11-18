import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, TrendingUp, Users } from "lucide-react";
import asgrLogo from "../assets/generated/asgr_basketball.png";

export default function ScoutingService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-16 px-4 border-b border-red-900/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img
                  src={asgrLogo}
                  alt="ASGR Basketball"
                  className="h-32 w-auto"
                  data-testid="img-logo"
                />
              </div>
              <h1 
                className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in"
                data-testid="text-hero-title"
              >
                THE{" "}
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                  ART
                </span>{" "}
                OF
              </h1>
              <h2 
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent"
                data-testid="text-hero-subtitle"
              >
                RECRUITING
              </h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                <h3 
                  className="text-2xl font-semibold text-gray-200"
                  data-testid="text-founder-name"
                >
                  MICHAEL T. WHITE
                </h3>
                <p 
                  className="text-lg text-red-400 uppercase tracking-wide"
                  data-testid="text-founder-title"
                >
                  Founder of All-Star Girls Report
                </p>
                <p 
                  className="text-gray-300 leading-relaxed"
                  data-testid="text-company-history"
                >
                  ASGR Basketball and ASGR Hoops was established in 1995 is a
                  full service Girls Basketball scouting, media and events
                  company, hosting grassroots basketball events, scouting
                  services and product placement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-black to-red-950/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
                data-testid="text-features-title"
              >
                Recruiting Features
              </h2>
              <p 
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                data-testid="text-features-subtitle"
              >
                ASGR Hoops is a customized version recruiting service
                specifically built for All Star Girls Report.
              </p>
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                The unequaled, in-depth player evaluations from the All Star
                Girls Report are produced by long time analyst Michael T. White
                will evaluate over 2,500 prospects at the High School, Transfer
                Portal, Juco 150, International and Middle School levels each
                year.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                The service that revolutionized women's basketball over the past
                several decade simply gets better and better. Beginning June 1,
                2025 through May 31, 2026, get our ASGR database Today!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <Database className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Exclusive ASGR Database
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Access our unequaled, in-depth scouting data with
                      comprehensive player evaluations.
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
                    <h3 className="font-semibold text-lg mb-2">
                      Real-Time Updates
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Stay up-to-date with inside information on national
                      evaluations, player ratings and rankings.
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
                    <h3 className="font-semibold text-lg mb-2">
                      Recruiting Trail Reports
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All the latest projections from major non and live viewing
                      period events.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-red-950/20 to-black border-red-900/30 p-8 mb-12">
              <p className="text-gray-300 text-lg leading-relaxed">
                Find all the recruiting needs with one, quick mobile stop. The
                ASGR database can give daily and weekly updates on current
                prospects that best fit your college system.
              </p>
            </Card>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-red-950/20 to-black border-y border-red-900/20">
          <div className="container mx-auto max-w-6xl">
            <h2 
              className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
              data-testid="text-rating-system-title"
            >
              ASGR RECRUITING RATING SYSTEM
            </h2>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-red-700/40 p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-red-600 text-white text-xl font-bold px-4 py-2 shrink-0">
                    98-100
                  </Badge>
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">
                      WNBA All-Star
                    </h3>
                    <p className="text-gray-300">
                      Future WNBA All-Star Projection
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-red-700/30 p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-red-700 text-white text-xl font-bold px-4 py-2 shrink-0">
                    93-97
                  </Badge>
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">
                      High Major Starters
                    </h3>
                    <p className="text-gray-300">
                      Impact Player at the American, Big East, ACC, Atlantic 10,
                      Big 12, Big Ten, Colonial, Conference USA, MAC, Missouri
                      Valley, Mountain West, Pac 12, Sun Belt and SEC.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-red-700/20 p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-red-800 text-white text-xl font-bold px-4 py-2 shrink-0">
                    89-92
                  </Badge>
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">
                      Marginal High Major to Mid Major Starters
                    </h3>
                    <p className="text-gray-300">
                      Impact Player at the American East, Atlantic Sun, Big
                      South, Big Sky, Big West, Horizon, MAAC, Mid Continent,
                      Ohio Valley, Southern, Ivy, MEAC, Northeast, Summit,
                      Southland, Patriot, SWAC, West Coast, WAC.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-black">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Scouting Service Packages
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Invest in the most comprehensive scouting service for women's basketball
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Premium Scouting Service - $1,495 */}
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/50 transition-all duration-300 overflow-hidden">
                <div className="p-6 text-center space-y-4">
                  <div className="flex justify-center mb-4">
                    <img
                      src={asgrLogo}
                      alt="ASGR Premium Service"
                      className="h-16 w-auto"
                    />
                  </div>
                  
                  <Badge className="bg-red-900/30 text-red-400 border-red-700/50 px-3 py-1">
                    Premium Scouting Service
                  </Badge>

                  <h3 className="text-xl font-bold">
                    2025-26 All-Star Girls Report Scouting Service
                  </h3>

                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-red-400">
                      $1,495
                    </span>
                  </div>

                  <div className="text-left space-y-2 py-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">Top 750 High School Class</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">National prospects in class 2026-2030</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">Top College Transfer Portal Prospects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">NCAA Certified Scouting Service</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Brand Marketing - $1,095 */}
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/50 transition-all duration-300 overflow-hidden">
                <div className="p-6 text-center space-y-4">
                  <div className="flex justify-center mb-4">
                    <img
                      src={asgrLogo}
                      alt="ASGR Brand Marketing"
                      className="h-16 w-auto"
                    />
                  </div>
                  
                  <Badge className="bg-red-900/30 text-red-400 border-red-700/50 px-3 py-1">
                    Brand Marketing
                  </Badge>

                  <h3 className="text-xl font-bold">
                    2025-2026 Brand Player Marketing Service
                  </h3>

                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-red-400">
                      $1,095
                    </span>
                  </div>

                  <div className="text-left space-y-2 py-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">Skill Assessment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">Consultation on College Placement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">Social Marketing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">24/7 Calendar Year Access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Player Development - $695 */}
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/50 transition-all duration-300 overflow-hidden">
                <div className="p-6 text-center space-y-4">
                  <div className="flex justify-center mb-4">
                    <img
                      src={asgrLogo}
                      alt="ASGR Player Development"
                      className="h-16 w-auto"
                    />
                  </div>
                  
                  <Badge className="bg-red-900/30 text-red-400 border-red-700/50 px-3 py-1">
                    Player Development
                  </Badge>

                  <h3 className="text-xl font-bold">
                    2025-2026 Player Development Program
                  </h3>

                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-red-400">
                      $695
                    </span>
                  </div>

                  <div className="text-left space-y-2 py-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">SoCal Player Development Program Packages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">Led by Kris Johnson, Player Development Specialist</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">Ball-Handling, Shooting, Footwork, Passing, Conditioning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✓</span>
                        <span className="text-gray-300">Decision Making, Leadership, Communication, Awareness, Habits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-card/30 backdrop-blur-sm border-red-900/30 p-6">
              <p className="text-sm text-gray-400 text-center">
                For more information or to purchase this service, please contact us at{" "}
                <a
                  href="mailto:info@asgrbasketball.com"
                  className="text-red-400 hover:text-red-300 underline"
                >
                  info@asgrbasketball.com
                </a>
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
