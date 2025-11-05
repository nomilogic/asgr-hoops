
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, FileText, Video, Calendar, TrendingUp, Award, Target } from "lucide-react";
import { Link } from "wouter";

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-20 px-4 border-b border-red-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
                Recruiting & Scouting Services
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Elevate your recruiting process with comprehensive scouting reports, detailed analytics, and expert evaluations of top basketball talent across the nation.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-black to-red-950/10">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              What We Offer
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Detailed Scouting Reports</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive evaluations including strengths, weaknesses, athletic profile, and skill breakdowns.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <Video className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Game Film Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Access to curated game footage and highlight reels with expert commentary and breakdowns.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <TrendingUp className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Performance Metrics</h3>
                    <p className="text-sm text-muted-foreground">
                      Statistical analysis, efficiency ratings, and advanced analytics to measure player impact.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <Users className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Player Comparisons</h3>
                    <p className="text-sm text-muted-foreground">
                      Side-by-side evaluations and college-level player comparisons for recruiting context.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <Calendar className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Tournament Coverage</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time updates and comprehensive coverage from major events and showcases.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30">
                    <Award className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Rankings Database</h3>
                    <p className="text-sm text-muted-foreground">
                      Access to Top 350 national rankings, circuit rankings, and high school rankings.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Service Packages */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Our Scouting Packages
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choose the package that best fits your recruiting needs. All packages include access to our comprehensive database and expert analysis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Package */}
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 p-8 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Basic Access</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-red-500">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Perfect for individual coaches getting started</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Access to Top 350 Rankings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Basic player profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Monthly tournament updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>

                <Link href="/contact">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Get Started
                  </Button>
                </Link>
              </Card>

              {/* Pro Package */}
              <Card className="bg-gradient-to-b from-red-950/30 to-card/50 backdrop-blur-sm border-red-700/50 hover:border-red-600/70 hover:shadow-xl hover:shadow-red-900/30 transition-all duration-300 p-8 flex flex-col relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600">
                  Most Popular
                </Badge>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Professional</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-red-500">$249</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Ideal for college programs and scouts</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Everything in Basic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Detailed scouting reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Game film access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced statistics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Player comparison tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>

                <Link href="/contact">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Get Started
                  </Button>
                </Link>
              </Card>

              {/* Elite Package */}
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 p-8 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Elite Program</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-red-500">$499</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Complete solution for D1 programs</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Everything in Professional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Unlimited scouting reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Custom player evaluations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Live event coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">24/7 priority support</span>
                  </li>
                </ul>

                <Link href="/contact">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Contact Us
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-red-950/10 to-black">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Why Choose ASGR Basketball?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30 h-fit">
                  <Target className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Expert Evaluations</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team of experienced scouts and former coaches provide in-depth analysis backed by years of basketball knowledge.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30 h-fit">
                  <Users className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Nationwide Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to talent from all 50 states, covering major tournaments, showcases, and high school competitions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30 h-fit">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Updated Weekly</h3>
                  <p className="text-sm text-muted-foreground">
                    Rankings and reports are constantly updated to reflect current performance and development.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-red-900/20 p-3 rounded-lg border border-red-700/30 h-fit">
                  <Award className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Trusted by Programs</h3>
                  <p className="text-sm text-muted-foreground">
                    Used by college coaches and programs across all division levels to identify and recruit top talent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-red-950/30 via-black to-red-950/30 border-t border-red-900/20">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Elevate Your Recruiting?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of college programs who trust ASGR Basketball for their scouting and recruiting needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Contact Us Today
                </Button>
              </Link>
              <Link href="/rankings/2025">
                <Button size="lg" variant="outline" className="border-red-600 hover:bg-red-950">
                  View Rankings
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
