import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Player } from "@shared/schema";

export default function Rankings() {
  const [, params] = useRoute("/rankings/:year");
  const year = params?.year ? parseInt(params.year) : 2025;

  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players/year", year],
    queryFn: async () => {
      const response = await fetch(`/api/players/year/${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      return response.json();
    },
  });

  const sortedPlayers = players?.sort((a, b) => {
    const rankA = a.rankNumber || 999;
    const rankB = b.rankNumber || 999;
    return rankA - rankB;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="bg-muted py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
              Top 350 High School Class {year}
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive rankings of the nation's top high school basketball players
            </p>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : sortedPlayers && sortedPlayers.length > 0 ? (
              <div className="space-y-4">
                <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-muted rounded-md font-semibold text-sm">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-3">Player</div>
                  <div className="col-span-1">Height</div>
                  <div className="col-span-1">Pos</div>
                  <div className="col-span-3">High School</div>
                  <div className="col-span-2">State</div>
                  <div className="col-span-1">Committed</div>
                </div>

                {sortedPlayers.map((player) => (
                  <Card
                    key={player.id}
                    className="overflow-hidden hover-elevate"
                    data-testid={`card-player-${player.id}`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center">
                      <div className="lg:col-span-1 flex lg:block items-center gap-4">
                        <Badge 
                          className="font-bold text-base min-w-12 min-h-12 flex items-center justify-center"
                          data-testid={`badge-rank-${player.id}`}
                        >
                          {player.rankNumber || '—'}
                        </Badge>
                        {player.imageUrl && (
                          <img
                            src={player.imageUrl}
                            alt={player.name}
                            className="lg:hidden w-16 h-20 object-cover rounded"
                            data-testid={`img-player-mobile-${player.id}`}
                          />
                        )}
                      </div>

                      <div className="lg:col-span-3 flex items-center gap-3">
                        {player.imageUrl && (
                          <img
                            src={player.imageUrl}
                            alt={player.name}
                            className="hidden lg:block w-12 h-16 object-cover rounded"
                            data-testid={`img-player-${player.id}`}
                          />
                        )}
                        <div>
                          <div className="font-semibold text-lg" data-testid={`text-player-name-${player.id}`}>
                            {player.name}
                          </div>
                          <div className="lg:hidden text-sm text-muted-foreground">
                            {player.heightFormatted && `${player.heightFormatted} • `}
                            {player.position && `${player.position} • `}
                            Class of {player.gradYear}
                          </div>
                        </div>
                      </div>

                      <div className="hidden lg:block lg:col-span-1 text-sm" data-testid={`text-height-${player.id}`}>
                        {player.heightFormatted || '—'}
                      </div>
                      
                      <div className="hidden lg:block lg:col-span-1 text-sm" data-testid={`text-position-${player.id}`}>
                        <Badge variant="outline">{player.position || '—'}</Badge>
                      </div>
                      
                      <div className="hidden lg:block lg:col-span-3 text-sm" data-testid={`text-high-school-${player.id}`}>
                        {player.school || '—'}
                      </div>
                      
                      <div className="hidden lg:block lg:col-span-2 text-sm text-muted-foreground" data-testid={`text-state-${player.id}`}>
                        {player.state || '—'}
                      </div>
                      
                      <div className="hidden lg:block lg:col-span-1 text-sm" data-testid={`text-committed-${player.id}`}>
                        {player.committedTo ? (
                          <Badge variant="secondary">{player.committedTo}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>

                      <div className="lg:hidden grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">School:</span> {player.school || '—'}
                        </div>
                        <div>
                          <span className="text-muted-foreground">State:</span> {player.state || '—'}
                        </div>
                        {player.committedTo && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Committed:</span>{' '}
                            <Badge variant="secondary">{player.committedTo}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No players found for class of {year}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
