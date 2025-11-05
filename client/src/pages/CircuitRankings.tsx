
import { useQuery } from "@tanstack/react-query";
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

export default function CircuitRankings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [circuitFilter, setCircuitFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");

  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
    queryFn: async () => {
      const response = await fetch(`/api/players`);
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      return response.json();
    },
  });

  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    
    return players
      .filter((player) => player.circuitProgram)
      .filter((player) => {
        const matchesSearch = searchQuery === "" || 
          player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.circuitProgram?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCircuit = circuitFilter === "all" || player.circuitProgram === circuitFilter;
        const matchesPosition = positionFilter === "all" || player.position === positionFilter;
        
        return matchesSearch && matchesCircuit && matchesPosition;
      })
      .sort((a, b) => {
        const rankA = a.rankNumber || 999;
        const rankB = b.rankNumber || 999;
        return rankA - rankB;
      });
  }, [players, searchQuery, circuitFilter, positionFilter]);

  const circuits = useMemo(() => {
    if (!players) return [];
    const uniqueCircuits = new Set(players.map(p => p.circuitProgram).filter(Boolean));
    return Array.from(uniqueCircuits).sort();
  }, [players]);

  const positions = useMemo(() => {
    if (!players) return [];
    const uniquePositions = new Set(players.map(p => p.position).filter(Boolean));
    return Array.from(uniquePositions).sort();
  }, [players]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-16 px-4 border-b border-red-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
                Circuit Rankings
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Top players ranked by their circuit program performance
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-card-border rounded-lg p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search players or circuits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
                
                <Select value={circuitFilter} onValueChange={setCircuitFilter}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="All Circuits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Circuits</SelectItem>
                    {circuits.map((circuit) => (
                      <SelectItem key={circuit} value={circuit}>{circuit}</SelectItem>
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
              
              {(searchQuery || circuitFilter !== "all" || positionFilter !== "all") && (
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredPlayers.length} players
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setCircuitFilter("all");
                      setPositionFilter("all");
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
                    className="overflow-hidden border-card-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300 group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                      <div className="lg:col-span-1 flex items-center justify-center lg:justify-start">
                        <Badge className="font-bold text-2xl w-16 h-16 flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 border-red-500/50 shadow-lg shadow-red-900/30">
                          {player.rankNumber || '—'}
                        </Badge>
                      </div>

                      <div className="lg:col-span-2 flex justify-center lg:justify-start">
                        {player.imageUrl ? (
                          <div className="relative w-32 h-40 rounded-lg overflow-hidden border-2 border-red-900/30 group-hover:border-red-600/50 transition-colors duration-300">
                            <img
                              src={player.imageUrl}
                              alt={player.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-40 rounded-lg bg-muted/50 border-2 border-muted flex items-center justify-center text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors duration-300">
                              {player.name}
                            </h3>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground font-medium min-w-24">Circuit:</span>
                                <Badge variant="outline" className="border-red-700/30 bg-red-950/20 font-semibold">
                                  {player.circuitProgram}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground font-medium min-w-24">Position:</span>
                                <span className="text-foreground font-semibold">{player.position || '—'}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground font-medium min-w-24">Height:</span>
                                <span className="text-foreground font-semibold">{player.heightFormatted || '—'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <span className="text-muted-foreground font-medium min-w-24">High School:</span>
                              <span className="text-foreground font-semibold">
                                {player.school || '—'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-medium min-w-24">Class:</span>
                              <span className="text-foreground font-semibold">{player.gradYear}</span>
                            </div>
                            
                            {player.committedTo && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground font-medium min-w-24">Committed:</span>
                                <Badge variant="secondary" className="bg-green-950/30 text-green-400 border-green-700/30 font-semibold">
                                  {player.committedTo}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
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
                <p className="text-muted-foreground">
                  No circuit players match your criteria
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
