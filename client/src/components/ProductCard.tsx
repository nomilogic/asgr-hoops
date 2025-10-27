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
    <Card className="hover-elevate overflow-hidden flex flex-col" data-testid={`card-product-${product.id}`}>
      <Link href={`/products/${product.slug}`}>
        <a>
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </a>
      </Link>
      
      <CardHeader className="gap-2 space-y-0 pb-4">
        <Badge variant="secondary" className="w-fit text-xs" data-testid={`badge-category-${product.id}`}>
          {product.category}
        </Badge>
        <Link href={`/products/${product.slug}`}>
          <a>
            <CardTitle className="text-xl hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </CardTitle>
          </a>
        </Link>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
          ${product.price}
        </div>
        <Link href={`/products/${product.slug}`}>
          <a>
            <Button variant="default" data-testid={`button-view-details-${product.id}`}>
              View Details
            </Button>
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
}
