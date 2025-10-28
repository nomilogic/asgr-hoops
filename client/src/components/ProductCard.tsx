import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="overflow-hidden border-red-900/30 bg-gradient-to-br from-card to-red-950/10 hover:shadow-[0_0_30px_rgba(255,0,0,0.3)] hover:border-red-700/50 transition-all duration-500 cursor-pointer h-full flex flex-col group hover:scale-105 animate-scale-in" data-testid={`card-product-${product.slug}`}>
        <div className="aspect-[4/3] overflow-hidden bg-black/50 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            data-testid={`img-product-${product.slug}`}
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-red-900/40 text-red-400 border-red-700/50" data-testid={`badge-category-${product.slug}`}>
              {product.category}
            </Badge>
            <span className="text-lg font-bold text-red-500 group-hover:text-red-400 transition-colors duration-300" data-testid={`text-price-${product.slug}`}>
              ${product.price}
            </span>
          </div>
          <CardTitle className="text-xl group-hover:text-red-400 transition-colors duration-300" data-testid={`text-name-${product.slug}`}>
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-gray-400 mb-4" data-testid={`text-description-${product.slug}`}>
            {product.description}
          </p>
          <ul className="space-y-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300" data-testid={`text-feature-${product.slug}-${index}`}>
                <span className="text-red-500 mt-0.5">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
}