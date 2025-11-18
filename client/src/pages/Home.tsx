
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

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
                ASGR{" "}
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                  EVENTS
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                ASGR Basketball and ASGR Hoops hosts premier grassroots
                basketball events, showcasing the nation's top talent.
              </p>
            </div>
          </div>
        </section>

        {/* National Events Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-black to-red-950/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                National Events
              </h2>
            </div>

            <div className="grid md:grid-cols-1 gap-8 mb-12">
              <Card className="bg-card/50 backdrop-blur-sm border-card-border hover:border-red-700/40 transition-all duration-300 overflow-hidden group">
                <div className="relative h-64">
                  <img
                    src="attached_assets/generated_images/Basketball_training_facility_95f9e2c2.png"
                    alt="Deep South Classic"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        Deep South Classic
                      </h3>
                      <p className="text-gray-300">
                        July 5-6, 2025 • Raleigh, NC
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 mb-4">
                        Our premier event bringing together the best talent from
                        across the southern region. Watch future stars compete at
                        the highest level.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 font-bold">Ages:</span>
                        <span className="text-gray-300">17U - 14U</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 font-bold">Cost:</span>
                        <span className="text-gray-300">$450</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 font-bold">General:</span>
                        <span className="text-gray-300">BallerTV Live Streaming Available</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <a
                        href="https://registration.asgrbasketball.com/product/deep-south-classic-2025/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Register
                      </a>
                      <a
                        href="/events"
                        className="border border-red-600 hover:bg-red-600/10 text-red-400 px-6 py-2 rounded-lg transition-colors"
                      >
                        More Info
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-red-950/20 to-black border-red-900/30 p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-400">
                Why Attend ASGR Events?
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✓</span>
                  <span>
                    Exposure to college coaches and recruiters from across the
                    nation
                  </span>
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
      </main>

      <Footer />
    </div>
  );
}
