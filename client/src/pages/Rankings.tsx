import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Player } from "@shared/schema";
import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";

export default function Rankings() {
  const [, params] = useRoute("/rankings/:year");
  const year = params?.year ? parseInt(params.year) : 2025;

  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");

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

  const filteredPlayers = useMemo(() => {
    if (!players) return [];

    return players
      .filter((player) => {
        const matchesSearch = searchQuery === "" || 
          player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.school?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPosition = positionFilter === "all" || player.position === positionFilter;
        const matchesState = stateFilter === "all" || player.state === stateFilter;

        return matchesSearch && matchesPosition && matchesState;
      })
      .sort((a, b) => {
        const rankA = a.rankNumber || 999;
        const rankB = b.rankNumber || 999;
        return rankA - rankB;
      });
  }, [players, searchQuery, positionFilter, stateFilter]);

  const positions = useMemo(() => {
    if (!players) return [];
    const uniquePositions = new Set(players.map(p => p.position).filter(Boolean));
    return Array.from(uniquePositions).sort();
  }, [players]);

  const states = useMemo(() => {
    if (!players) return [];
    const uniqueStates = new Set(players.map(p => p.state).filter(Boolean));
    return Array.from(uniqueStates).sort();
  }, [players]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-16 px-4 border-b border-red-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent" data-testid="text-page-title">
                Top 350 Rankings
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                Class of {year}
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Comprehensive rankings of the nation's top high school basketball players
              </p>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <a
                    key={y}
                    href={`/rankings/${y}`}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      y === year
                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                        : 'bg-card/50 text-muted-foreground hover:bg-red-950/50 hover:text-red-400 border border-red-900/30'
                    }`}
                  >
                    {y}
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-card-border rounded-lg p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search players or schools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>

                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="All Positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || positionFilter !== "all" || stateFilter !== "all") && (
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredPlayers.length} of {players?.length || 0} players
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setPositionFilter("all");
                      setStateFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-card/70 border border-card-border rounded-lg p-6 mb-4 sticky top-16 z-10 backdrop-blur-sm">
              <div className="grid grid-cols-12 gap-4 items-center font-semibold text-sm text-muted-foreground">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-3">Name</div>
                <div className="col-span-1 text-center">HT</div>
                <div className="col-span-1 text-center">POS</div>
                <div className="col-span-1 text-center">Grad Year</div>
                <div className="col-span-2">High School</div>
                <div className="col-span-2">Circuit Program</div>
                <div className="col-span-1 text-center">College</div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredPlayers && filteredPlayers.length > 0 ? (
              <div className="space-y-4">
                {filteredPlayers.map((player) => (
                  <Card
                    key={player.id}
                    className="overflow-hidden border-card-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300"
                    data-testid={`card-player-${player.id}`}
                  >
                    <div className="grid grid-cols-12 gap-4 p-6 items-center">
                      <div className="col-span-1 flex justify-center">
                        <Badge 
                          className="font-bold text-xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 border-red-500/50"
                          data-testid={`badge-rank-${player.id}`}
                        >
                          {player.rankNumber || '—'}
                        </Badge>
                      </div>

                      <div className="col-span-3 flex items-center gap-3">
                        {player.imageUrl ? (
                          <img
                            src={player.imageUrl}
                            alt={player.name}
                            className="w-12 h-16 object-cover rounded border border-red-900/30"
                            data-testid={`img-player-${player.id}`}
                          />
                        ) : (
                          <div className="w-12 h-16 rounded bg-muted/50 border border-muted flex items-center justify-center text-xs text-muted-foreground">
                            N/A
                          </div>
                        )}
                        <span className="font-bold text-base" data-testid={`text-player-name-${player.id}`}>
                          {player.name}
                        </span>
                      </div>

                      <div className="col-span-1 text-center">
                        <span className="text-sm font-semibold">{player.heightFormatted || '—'}</span>
                      </div>

                      <div className="col-span-1 text-center">
                        <Badge variant="outline" className="border-red-700/30 bg-red-950/20">
                          {player.position || '—'}
                        </Badge>
                      </div>

                      <div className="col-span-1 text-center">
                        <span className="text-sm font-semibold">{player.gradYear}</span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-sm" data-testid={`text-high-school-${player.id}`}>
                          {player.school || '—'}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-sm">{player.circuitProgram || '—'}</span>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        {player.committedTo && (
                          <img
                            src={`/attached_assets/${player.committedTo.replace(/\s+/g, '-')}-Logo.png`}
                            alt={player.committedTo}
                            className="h-10 w-10 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-xs font-semibold text-green-400">${player.committedTo}</span>`;
                              }
                            }}
                            data-testid={`text-committed-${player.id}`}
                          />
                        )}
                        {!player.committedTo && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No players found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || positionFilter !== "all" || stateFilter !== "all"
                    ? "Try adjusting your filters"
                    : `No players found for class of ${year}`}
                </p>
                {(searchQuery || positionFilter !== "all" || stateFilter !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setPositionFilter("all");
                      setStateFilter("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}