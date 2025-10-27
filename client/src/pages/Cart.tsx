import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import type { CartItem, Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Cart() {
  const { toast } = useToast();

  const { data: cart, isLoading: cartLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/cart/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Item removed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cartWithProducts = cart?.map(item => ({
    ...item,
    product: products?.find(p => p.id === item.productId),
  })).filter(item => item.product !== undefined);

  const subtotal = cartWithProducts?.reduce(
    (sum, item) => sum + parseFloat(item.product!.price) * item.quantity,
    0
  ) || 0;

  const isLoading = cartLoading || productsLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-page-title">
            Shopping Cart
          </h1>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : !cartWithProducts || cartWithProducts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2" data-testid="text-empty-cart">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Add some packages to get started with our scouting services
                </p>
                <Link href="/products" asChild>
                  <Button variant="default" data-testid="button-shop-now">
                    Shop Packages
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartWithProducts.map((item) => (
                  <Card key={item.id} data-testid={`card-cart-item-${item.id}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.product!.imageUrl}
                          alt={item.product!.name}
                          className="w-24 h-24 object-cover rounded"
                          data-testid={`img-product-${item.id}`}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1" data-testid={`text-product-name-${item.id}`}>
                            {item.product!.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            ${item.product!.price} / year
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantityMutation.mutate({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  });
                                }
                              }}
                              disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              data-testid={`button-decrease-${item.id}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = Math.max(1, parseInt(e.target.value) || 1);
                                if (newQty !== item.quantity) {
                                  updateQuantityMutation.mutate({
                                    id: item.id,
                                    quantity: newQty,
                                  });
                                }
                              }}
                              className="w-16 h-8 text-center"
                              data-testid={`input-quantity-${item.id}`}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  id: item.id,
                                  quantity: item.quantity + 1,
                                })
                              }
                              disabled={updateQuantityMutation.isPending}
                              data-testid={`button-increase-${item.id}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 ml-auto"
                              onClick={() => removeItemMutation.mutate(item.id)}
                              disabled={removeItemMutation.isPending}
                              data-testid={`button-remove-${item.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold" data-testid={`text-item-total-${item.id}`}>
                            ${(parseFloat(item.product!.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span>$0.00</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary" data-testid="text-total">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full" size="lg" data-testid="button-checkout">
                      Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
