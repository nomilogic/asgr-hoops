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
import type { CircuitTeam } from "@shared/schema";
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface CircuitTeamWithRanking {
  id: number;
  team: string;
  circuit: string | null;
  rank: number;
  record: string;
  keyWins: string;
  placement: string;
}

export default function CircuitRankings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view circuit rankings.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const [, params] = useRoute("/rankings/circuit/:year");
  const year = params?.year || "2024";
  const season = `${year} Circuit Season`;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [circuitFilter, setCircuitFilter] = useState<string>("all");

  const { data: teams, isLoading } = useQuery<CircuitTeam[]>({
    queryKey: ["/api/circuit-teams"],
  });

  const teamsWithRankings = useMemo(() => {
    if (!teams) return [];
    
    return teams
      .map((team) => {
        const rank = (team.ranks as Record<string, number>)?.[season];
        const record = (team.records as Record<string, string>)?.[season];
        const keyWins = (team.keyWins as Record<string, string>)?.[season];
        const placement = (team.placements as Record<string, string>)?.[season];
        
        if (!rank) return null;
        
        return {
          id: team.id,
          team: team.team,
          circuit: team.circuit,
          rank,
          record: record || "—",
          keyWins: keyWins || "—",
          placement: placement || "—",
        };
      })
      .filter((team): team is CircuitTeamWithRanking => team !== null)
      .sort((a, b) => a.rank - b.rank);
  }, [teams, season]);

  const filteredTeams = useMemo(() => {
    if (!teamsWithRankings) return [];
    
    return teamsWithRankings.filter((team) => {
      const matchesSearch = searchQuery === "" || 
        team.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.keyWins.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCircuit = circuitFilter === "all" || team.circuit === circuitFilter;
      
      return matchesSearch && matchesCircuit;
    });
  }, [teamsWithRankings, searchQuery, circuitFilter]);

  const circuits = useMemo(() => {
    if (!teamsWithRankings) return [];
    const uniqueCircuits = new Set(teamsWithRankings.map(t => t.circuit).filter(Boolean));
    return Array.from(uniqueCircuits).sort();
  }, [teamsWithRankings]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-16 px-4 border-b border-red-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="h-12 w-12 text-red-500" />
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent" data-testid="text-page-title">
                  Circuit Rankings
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Top circuit teams ranked by performance and win percentage
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-card-border rounded-lg p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search circuit teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                    data-testid="input-search"
                  />
                </div>
                
                <Select value={circuitFilter} onValueChange={setCircuitFilter}>
                  <SelectTrigger className="bg-background/50" data-testid="select-circuit-filter">
                    <SelectValue placeholder="All Circuits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Circuits</SelectItem>
                    {circuits.map((circuit) => (
                      <SelectItem key={circuit} value={circuit || ""}>{circuit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(searchQuery || circuitFilter !== "all") && (
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredTeams.length} of {teamsWithRankings?.length || 0} teams
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setCircuitFilter("all");
                    }}
                    data-testid="button-clear-filters"
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
                <div className="col-span-3">Team Name</div>
                <div className="col-span-2 text-center">Circuit</div>
                <div className="col-span-2 text-center">Record</div>
                <div className="col-span-2 text-center">Placement</div>
                <div className="col-span-2">Key Wins</div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredTeams && filteredTeams.length > 0 ? (
              <div className="space-y-4">
                {filteredTeams.map((team) => (
                  <Card
                    key={team.id}
                    className="overflow-hidden border-card-border bg-card/50 backdrop-blur-sm hover-elevate active-elevate-2 transition-all duration-300"
                    data-testid={`card-team-${team.id}`}
                  >
                    <div className="grid grid-cols-12 gap-4 p-6 items-center">
                      <div className="col-span-1 flex justify-center">
                        <Badge 
                          className="font-bold text-xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 border-red-500/50"
                          data-testid={`badge-rank-${team.id}`}
                        >
                          {team.rank}
                        </Badge>
                      </div>

                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-700/30 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-red-400" />
                        </div>
                        <span className="font-bold text-lg" data-testid={`text-team-name-${team.id}`}>
                          {team.team}
                        </span>
                      </div>

                      <div className="col-span-2 text-center">
                        <Badge variant="outline" className="border-red-700/30 bg-red-950/20">
                          {team.circuit || '—'}
                        </Badge>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="text-sm font-bold" data-testid={`text-record-${team.id}`}>
                          {team.record}
                        </span>
                      </div>

                      <div className="col-span-2 text-center">
                        <Badge className="font-semibold bg-blue-900/30 border-blue-700/30 text-blue-400" data-testid={`text-placement-${team.id}`}>
                          {team.placement}
                        </Badge>
                      </div>

                      <div className="col-span-2">
                        <span className="text-sm text-muted-foreground" data-testid={`text-key-wins-${team.id}`}>
                          {team.keyWins}
                        </span>
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
                <h3 className="text-xl font-semibold mb-2">No teams found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria
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
