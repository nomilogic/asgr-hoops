import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

export default function MerchShop() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-16 px-4 border-b border-red-900/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-8">
              <h1 
                className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in"
                data-testid="text-merch-title"
              >
                ASGR{" "}
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                  MERCH SHOP
                </span>
              </h1>
              <p 
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                data-testid="text-merch-subtitle"
              >
                Official ASGR Basketball merchandise coming soon!
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-black to-red-950/20">
          <div className="container mx-auto max-w-6xl">
            <Card className="bg-card/50 backdrop-blur-sm border-card-border p-8 text-center">
              <h2 
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
                data-testid="text-coming-soon"
              >
                Coming Soon
              </h2>
              <p 
                className="text-lg text-gray-300 mb-6"
                data-testid="text-merch-description"
              >
                We're working on bringing you the best ASGR Basketball merchandise. 
                Check back soon for official apparel, equipment, and more!
              </p>
              <p className="text-sm text-gray-400">
                For inquiries, contact us at{" "}
                <a
                  href="mailto:info@asgrbasketball.com"
                  className="text-red-400 hover:text-red-300 underline"
                  data-testid="link-merch-contact"
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
