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
import type { HighSchool } from "@shared/schema";
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SchoolWithRanking {
  id: number;
  school: string;
  logoPath: string | null;
  rank: number;
  record: string;
  keyWins: string;
  state: string;
}

export default function HighSchoolRankings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view high school rankings.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const [, params] = useRoute("/rankings/high-school/:season");
  const seasonParam = params?.season || "2024-25";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [season, setSeason] = useState<string>(seasonParam);

  const { data: highSchools, isLoading } = useQuery<HighSchool[]>({
    queryKey: ["/api/high-schools"],
  });

  const schoolsWithRankings = useMemo(() => {
    if (!highSchools) return [];
    
    return highSchools
      .map((school) => {
        const rank = (school.ranks as Record<string, number>)?.[season];
        const record = (school.records as Record<string, string>)?.[season];
        const keyWins = (school.keyWins as Record<string, string>)?.[season];
        const state = school.school.match(/\(([^)]+)\)$/)?.[1] || "";
        
        if (!rank) return null;
        
        return {
          id: school.id,
          school: school.school,
          logoPath: school.logoPath,
          rank,
          record: record || "—",
          keyWins: keyWins || "—",
          state,
        };
      })
      .filter((school): school is SchoolWithRanking => school !== null)
      .sort((a, b) => a.rank - b.rank);
  }, [highSchools, season]);

  const filteredRankings = useMemo(() => {
    if (!schoolsWithRankings) return [];
    
    return schoolsWithRankings.filter((ranking) => {
      const matchesSearch = searchQuery === "" || 
        ranking.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ranking.keyWins.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = stateFilter === "all" || ranking.state === stateFilter;
      
      return matchesSearch && matchesState;
    });
  }, [schoolsWithRankings, searchQuery, stateFilter]);

  const states = useMemo(() => {
    if (!schoolsWithRankings) return [];
    const uniqueStates = new Set(schoolsWithRankings.map(r => r.state).filter(Boolean));
    return Array.from(uniqueStates).sort();
  }, [schoolsWithRankings]);

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
                  High School Rankings
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Top-ranked high school basketball programs nationwide
              </p>

              <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
                {["2024-25", "2023-24"].map((s) => (
                  <a
                    key={s}
                    href={`/rankings/high-school/${s}`}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      s === season
                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                        : 'bg-card/50 text-muted-foreground hover:bg-red-950/50 hover:text-red-400 border border-red-900/30'
                    }`}
                    data-testid={`button-season-${s}`}
                  >
                    {s} Season
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-card-border rounded-lg p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schools or key wins..."
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
                    Showing {filteredRankings.length} of {schoolsWithRankings?.length || 0} schools
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
                <div className="col-span-4">High School</div>
                <div className="col-span-2 text-center">State</div>
                <div className="col-span-1 text-center">W/L</div>
                <div className="col-span-4">Key Wins</div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredRankings && filteredRankings.length > 0 ? (
              <div className="space-y-4">
                {filteredRankings.map((ranking) => (
                  <Card
                    key={ranking.id}
                    className="overflow-hidden border-card-border bg-card/50 backdrop-blur-sm hover-elevate active-elevate-2 transition-all duration-300"
                    data-testid={`card-school-${ranking.id}`}
                  >
                    <div className="grid grid-cols-12 gap-4 p-6 items-center">
                      <div className="col-span-1 flex justify-center">
                        <Badge 
                          className="font-bold text-xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 border-red-500/50"
                          data-testid={`badge-rank-${ranking.id}`}
                        >
                          {ranking.rank}
                        </Badge>
                      </div>

                      <div className="col-span-4 flex items-center gap-3">
                        {ranking.logoPath ? (
                          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-2 border-2 border-red-500/40 shadow-lg shadow-red-500/30">
                            <img
                              src={ranking.logoPath}
                              alt={ranking.school}
                              className="w-full h-full object-contain"
                              data-testid={`img-school-logo-${ranking.id}`}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-muted/50 border-2 border-muted shadow-lg shadow-muted/30 flex items-center justify-center">
                            <Trophy className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-bold text-lg" data-testid={`text-school-name-${ranking.id}`}>
                          {ranking.school}
                        </span>
                      </div>

                      <div className="col-span-2 text-center">
                        <Badge variant="outline" className="border-red-700/30 bg-red-950/20">
                          {ranking.state || '—'}
                        </Badge>
                      </div>

                      <div className="col-span-1 text-center">
                        <span className="text-sm font-bold" data-testid={`text-record-${ranking.id}`}>
                          {ranking.record}
                        </span>
                      </div>

                      <div className="col-span-4">
                        <span className="text-sm text-muted-foreground" data-testid={`text-key-wins-${ranking.id}`}>
                          {ranking.keyWins}
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
                <h3 className="text-xl font-semibold mb-2">No schools found</h3>
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
