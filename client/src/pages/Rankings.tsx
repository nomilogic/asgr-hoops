import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Player } from "@shared/schema";

export default function Rankings() {
  const [, params] = useRoute("/rankings/:year");
  const year = params?.year ? parseInt(params.year) : 2025;
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players", year],
    queryFn: async () => {
      const response = await fetch(`/api/players/${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      return response.json();
    },
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 98) return "bg-primary text-primary-foreground";
    if (rating >= 96) return "bg-accent text-accent-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-12 px-4">
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : players && players.length > 0 ? (
              <div className="space-y-2">
                <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-muted rounded-lg font-semibold text-sm uppercase tracking-wide">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-3">Player</div>
                  <div className="col-span-1">HT</div>
                  <div className="col-span-1">Pos</div>
                  <div className="col-span-2">High School</div>
                  <div className="col-span-2">Circuit</div>
                  <div className="col-span-2">College</div>
                </div>

                {players.map((player) => (
                  <Card
                    key={player.id}
                    className="overflow-hidden hover-elevate cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === player.id ? null : player.id)}
                    data-testid={`card-player-${player.rank}`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center">
                      <div className="lg:col-span-1 flex lg:block items-center gap-4 lg:gap-0">
                        <Badge 
                          className={`font-bold text-base w-12 h-12 flex items-center justify-center ${getRatingColor(player.rating)}`}
                          data-testid={`badge-rank-${player.rank}`}
                        >
                          {player.rank}
                        </Badge>
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="lg:hidden w-16 h-20 object-cover rounded"
                        />
                      </div>

                      <div className="lg:col-span-3 flex items-center gap-3">
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="hidden lg:block w-12 h-16 object-cover rounded"
                          data-testid={`img-player-${player.rank}`}
                        />
                        <div>
                          <div className="font-semibold text-lg" data-testid={`text-player-name-${player.rank}`}>
                            {player.name}
                          </div>
                          <div className="lg:hidden text-sm text-muted-foreground">
                            {player.height} • {player.position} • Class of {player.gradYear}
                          </div>
                        </div>
                      </div>

                      <div className="hidden lg:block lg:col-span-1 text-sm" data-testid={`text-height-${player.rank}`}>
                        {player.height}
                      </div>
                      <div className="hidden lg:block lg:col-span-1 text-sm" data-testid={`text-position-${player.rank}`}>
                        {player.position}
                      </div>
                      <div className="hidden lg:block lg:col-span-2 text-sm" data-testid={`text-high-school-${player.rank}`}>
                        {player.highSchool}
                      </div>
                      <div className="hidden lg:block lg:col-span-2 text-sm text-muted-foreground" data-testid={`text-circuit-${player.rank}`}>
                        {player.circuitProgram}
                      </div>
                      <div className="hidden lg:flex lg:col-span-2 items-center gap-2">
                        {player.college ? (
                          <>
                            {player.collegeLogo && (
                              <img
                                src={player.collegeLogo}
                                alt={player.college}
                                className="w-8 h-8 object-contain"
                              />
                            )}
                            <span className="text-sm font-medium" data-testid={`text-college-${player.rank}`}>
                              {player.college}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Undecided</span>
                        )}
                      </div>

                      <div className="lg:hidden flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">College: </span>
                          <span className="font-medium">{player.college || "Undecided"}</span>
                        </div>
                        {expandedRow === player.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {expandedRow === player.id && (
                      <div className="border-t bg-muted/30 p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <Badge className={`${getRatingColor(player.rating)}`}>
                            Rating: {player.rating}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed italic" data-testid={`text-rating-description-${player.rank}`}>
                          {player.ratingDescription}
                        </p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">High School: </span>
                            <span>{player.highSchool}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Circuit: </span>
                            <span>{player.circuitProgram}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground" data-testid="text-no-players">
                  No rankings available for class of {year}.
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
