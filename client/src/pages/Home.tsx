
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-16 px-4 border-b border-red-900/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                ASGR <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">EVENTS</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                ASGR Basketball and ASGR Hoops hosts premier grassroots basketball events, showcasing the nation's top talent.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/products" asChild>
                  <Button size="lg" variant="default" className="animate-pulse-glow hover:scale-105 transition-transform duration-300">
                    View Scouting Packages
                  </Button>
                </Link>
                <Link href="/rankings/top350/2025" asChild>
                  <Button size="lg" variant="outline" className="border-red-600 hover:bg-red-950 hover:scale-105 transition-all duration-300">
                    View Rankings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-black to-red-950/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Upcoming Events
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join us at our elite basketball tournaments and showcases
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 transition-all duration-300 overflow-hidden group">
                <div className="relative h-64">
                  <img 
                    src="/attached_assets/AddisonMackPhoto-e1726688270253.jpg" 
                    alt="Deep South Classic"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">Deep South Classic</h3>
                      <p className="text-gray-300">Elite showcase featuring top prospects</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-400 mb-4">
                    Our premier event bringing together the best talent from across the southern region. Watch future stars compete at the highest level.
                  </p>
                  <div className="flex gap-2 text-sm text-red-400">
                    <span>📅 TBA</span>
                    <span>•</span>
                    <span>📍 Location TBA</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 transition-all duration-300 overflow-hidden group">
                <div className="relative h-64">
                  <img 
                    src="/attached_assets/AliciaMitchellPhoto-e1717177516868.jpg" 
                    alt="National Showcase"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">National Showcase</h3>
                      <p className="text-gray-300">Nation's top-ranked players compete</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-400 mb-4">
                    The ultimate platform for college coaches to evaluate the country's elite talent in one location.
                  </p>
                  <div className="flex gap-2 text-sm text-red-400">
                    <span>📅 TBA</span>
                    <span>•</span>
                    <span>📍 Location TBA</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-red-950/20 to-black border-red-900/30 p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-400">Why Attend ASGR Events?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✓</span>
                  <span>Exposure to college coaches and recruiters from across the nation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✓</span>
                  <span>Compete against the best players in your class</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✓</span>
                  <span>Professional scouting and evaluation services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✓</span>
                  <span>Media coverage and highlight reels</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Featured Prospects */}
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="group relative overflow-hidden rounded-lg border border-red-900/30 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
                <img 
                  src="/attached_assets/AddisonMackPhoto-e1726688270253.jpg" 
                  alt="Top Prospect"
                  className="aspect-[3/4] w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                  <div className="text-white">
                    <div className="text-sm font-bold">Rank #1</div>
                    <div className="text-xs text-red-400">Class of 2025</div>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border border-red-900/30 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
                <img 
                  src="/attached_assets/AliciaMitchellPhoto-e1717177516868.jpg" 
                  alt="Top Prospect"
                  className="aspect-[3/4] w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                  <div className="text-white">
                    <div className="text-sm font-bold">Rank #2</div>
                    <div className="text-xs text-red-400">Class of 2025</div>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border border-red-900/30 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
                <img 
                  src="/attached_assets/AmaniJenkinsPhoto-e1726612378162.jpg" 
                  alt="Top Prospect"
                  className="aspect-[3/4] w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                  <div className="text-white">
                    <div className="text-sm font-bold">Rank #5</div>
                    <div className="text-xs text-red-400">Class of 2025</div>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border border-red-900/30 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
                <img 
                  src="/attached_assets/AveryCooperPhoto-e1726676217614.jpg" 
                  alt="Top Prospect"
                  className="aspect-[3/4] w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                  <div className="text-white">
                    <div className="text-sm font-bold">Rank #10</div>
                    <div className="text-xs text-red-400">Class of 2025</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/rankings/top350/2025" asChild>
                <Button size="lg" variant="outline" className="border-red-600 hover:bg-red-950">
                  View Full Rankings
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
