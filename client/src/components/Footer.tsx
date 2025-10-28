import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t border-red-900/30 bg-gradient-to-b from-black to-red-950/20 mt-auto">
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">About ASGR</h3>
            <p className="text-sm text-muted-foreground">
              All-Star Girls Report provides comprehensive basketball scouting services
              for high school players nationwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-events">
                Events
              </Link>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-products">
                Scouting Service
              </Link>
              <Link href="/rankings/2025" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-rankings">
                Player Rankings
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground" data-testid="footer-link-contact">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Stay updated with the latest rankings and news.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button variant="default" data-testid="button-subscribe">
                Subscribe
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="button-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-email">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 ASGR Basketball. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
