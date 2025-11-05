import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CircuitTeam, PlayerCircuitTeam } from "@shared/schema";
import { useState, useMemo } from "react";
import { Search, Filter, Trophy } from "lucide-react";

interface CircuitTeamWithStats extends CircuitTeam {
  totalWins: number;
  totalLosses: number;
  playerCount: number;
}

export default function CircuitRankings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");

  const { data: teams, isLoading: teamsLoading } = useQuery<CircuitTeam[]>({
    queryKey: ["/api/circuit-teams"],
  });

  const { data: teamRelations, isLoading: relationsLoading } = useQuery<PlayerCircuitTeam[]>({
    queryKey: ["/api/player-circuit-teams"],
  });

  const isLoading = teamsLoading || relationsLoading;

  const teamsWithStats = useMemo(() => {
    if (!teams || !teamRelations) return [];
    
    return teams.map(team => {
      const teamRecords = teamRelations.filter(r => r.circuitTeamId === team.id);
      const totalWins = teamRecords.reduce((sum, r) => sum + (r.wins || 0), 0);
      const totalLosses = teamRecords.reduce((sum, r) => sum + (r.losses || 0), 0);
      
      return {
        ...team,
        totalWins,
        totalLosses,
        playerCount: teamRecords.length,
      };
    }).sort((a, b) => {
      const winPctA = a.totalWins + a.totalLosses > 0 ? a.totalWins / (a.totalWins + a.totalLosses) : 0;
      const winPctB = b.totalWins + b.totalLosses > 0 ? b.totalWins / (b.totalWins + b.totalLosses) : 0;
      return winPctB - winPctA || b.totalWins - a.totalWins;
    });
  }, [teams, teamRelations]);

  const filteredTeams = useMemo(() => {
    if (!teamsWithStats) return [];
    
    return teamsWithStats.filter((team) => {
      const matchesSearch = searchQuery === "" || 
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = stateFilter === "all" || team.state === stateFilter;
      
      return matchesSearch && matchesState;
    });
  }, [teamsWithStats, searchQuery, stateFilter]);

  const states = useMemo(() => {
    if (!teams) return [];
    const uniqueStates = new Set(teams.map(t => t.state).filter(Boolean));
    return Array.from(uniqueStates).sort();
  }, [teams]);

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
                
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="bg-background/50" data-testid="select-state-filter">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state || ""}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(searchQuery || stateFilter !== "all") && (
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredTeams.length} of {teamsWithStats?.length || 0} teams
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStateFilter("all");
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
                <div className="col-span-5">Team Name</div>
                <div className="col-span-2 text-center">State</div>
                <div className="col-span-2 text-center">Record</div>
                <div className="col-span-2 text-center">Win %</div>
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
                {filteredTeams.map((team, index) => {
                  const winPct = team.totalWins + team.totalLosses > 0 
                    ? (team.totalWins / (team.totalWins + team.totalLosses) * 100).toFixed(1)
                    : '0.0';
                  
                  return (
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
                            {index + 1}
                          </Badge>
                        </div>

                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-700/30 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-red-400" />
                          </div>
                          <div>
                            <span className="font-bold text-lg block" data-testid={`text-team-name-${team.id}`}>
                              {team.teamName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {team.playerCount} players
                            </span>
                          </div>
                        </div>

                        <div className="col-span-2 text-center">
                          <Badge variant="outline" className="border-red-700/30 bg-red-950/20">
                            {team.state || '—'}
                          </Badge>
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="text-sm font-bold" data-testid={`text-record-${team.id}`}>
                            {team.totalWins}-{team.totalLosses}
                          </span>
                        </div>

                        <div className="col-span-2 text-center">
                          <Badge 
                            className={`font-semibold ${
                              parseFloat(winPct) >= 70 
                                ? 'bg-green-900/30 border-green-700/30 text-green-400' 
                                : parseFloat(winPct) >= 50
                                ? 'bg-yellow-900/30 border-yellow-700/30 text-yellow-400'
                                : 'bg-red-900/30 border-red-700/30 text-red-400'
                            }`}
                            data-testid={`text-win-pct-${team.id}`}
                          >
                            {winPct}%
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
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
