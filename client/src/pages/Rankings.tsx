import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Player, College } from "@shared/schema";
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ChevronDown, ChevronUp, TrendingUp, Star, FileText, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Rankings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view rankings.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);
  const [, params] = useRoute("/rankings/:year");
  const yearParam = params?.year ? parseInt(params.year) : 2025;
  const year = isNaN(yearParam) ? 2025 : yearParam;

  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [openPlayerId, setOpenPlayerId] = useState<number | null>(null);

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

  const { data: colleges } = useQuery<College[]>({
    queryKey: ["/api/colleges"],
    queryFn: async () => {
      const response = await fetch("/api/colleges");
      if (!response.ok) {
        throw new Error("Failed to fetch colleges");
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
          player.highSchool?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPosition = positionFilter === "all" || player.position === positionFilter;
        const matchesState = stateFilter === "all" || player.state === stateFilter;

        return matchesSearch && matchesPosition && matchesState;
      })
      .sort((a, b) => {
        // Use rank from ranks JSON column if available, otherwise fall back to rank field
        const rankA = a.ranks?.[year.toString()] || a.rank || 999999;
        const rankB = b.ranks?.[year.toString()] || b.rank || 999999;
        return rankA - rankB;
      });
  }, [players, searchQuery, positionFilter, stateFilter, year]);

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
                    data-testid={`link-year-${y}`}
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

                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger className="bg-background/50" data-testid="select-position-filter">
                    <SelectValue placeholder="All Positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos || ""}>{pos}</SelectItem>
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
                {filteredPlayers.map((player) => {
                  const isOpen = openPlayerId === player.id;

                  return (
                    <Collapsible
                      key={player.id}
                      open={isOpen}
                      onOpenChange={(open) => setOpenPlayerId(open ? player.id : null)}
                    >
                      <Card
                        className="overflow-visible border-card-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 transition-all duration-300"
                        data-testid={`card-player-${player.id}`}
                      >
                        <CollapsibleTrigger asChild>
                          <button className="w-full grid grid-cols-12 gap-4 p-6 items-center text-left hover-elevate active-elevate-2" data-testid={`button-toggle-player-${player.id}`} aria-label={`Toggle details for ${player.name}`}>
                            <div className="col-span-1 flex justify-center">
                              <Badge 
                                className="font-bold text-xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 border-red-500/50"
                                data-testid={`badge-rank-${player.id}`}
                              >
                                {player.ranks?.[year.toString()] || player.rank || '—'}
                              </Badge>
                            </div>

                            <div className="col-span-3 flex items-center gap-3">
                              {player.imagePath ? (
                                <img
                                  src={player.imagePath}
                                  alt={player.name}
                                  className="w-12 h-16 object-cover rounded border border-red-900/30"
                                  data-testid={`img-player-${player.id}`}
                                />
                              ) : (
                                <div className="w-12 h-16 rounded bg-muted/50 border border-muted flex items-center justify-center text-xs text-muted-foreground">
                                  N/A
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base" data-testid={`text-player-name-${player.id}`}>
                                  {player.name}
                                </span>
                                {isOpen ? (
                                  <ChevronUp className="h-4 w-4 text-red-500" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>

                            <div className="col-span-1 text-center">
                              <span className="text-sm font-semibold">{player.height || '—'}</span>
                            </div>

                            <div className="col-span-1 text-center">
                              <Badge variant="outline" className="border-red-700/30 bg-red-950/20">
                                {player.position || '—'}
                              </Badge>
                            </div>

                            <div className="col-span-1 text-center">
                              <span className="text-sm font-semibold">{player.gradeYear}</span>
                            </div>

                            <div className="col-span-2">
                              <span className="text-sm" data-testid={`text-high-school-${player.id}`}>
                                {player.highSchool || '—'}
                              </span>
                            </div>

                            <div className="col-span-2">
                              <span className="text-sm">{player.circuitProgram || '—'}</span>
                            </div>

                            <div className="col-span-1 flex flex-col items-center justify-center gap-1">
                              {player.committedCollegeId && colleges ? (
                                (() => {
                                  const college = colleges.find(c => c.id === player.committedCollegeId);
                                  const logoUrl = college?.logoUrl || college?.logoPath;
                                  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                                  const bucketName = 'asgr-images';
                                  
                                  // Construct full URL if logoPath is relative
                                  const fullLogoUrl = logoUrl 
                                    ? (logoUrl.startsWith('http') 
                                        ? logoUrl 
                                        : `${supabaseUrl}/storage/v1/object/public/${bucketName}/${logoUrl}`)
                                    : null;
                                  
                                  return college ? (
                                    <>
                                      {fullLogoUrl && (
                                        <img
                                          src={fullLogoUrl}
                                          alt={college.name}
                                          className="h-10 w-10 object-contain"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                          }}
                                        />
                                      )}
                                      <span className="text-xs font-semibold text-green-400 text-center" data-testid={`text-committed-${player.id}`}>
                                        {college.name}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-xs font-semibold text-green-400 text-center" data-testid={`text-committed-${player.id}`}>
                                      {player.committedCollege || '—'}
                                    </span>
                                  );
                                })()
                              ) : player.committedCollege ? (
                                <span className="text-xs font-semibold text-green-400 text-center" data-testid={`text-committed-${player.id}`}>
                                  {player.committedCollege}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </div>
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="px-6 pb-6 pt-2 border-t border-border/50">
                            {(() => {
                              const ranksEntries = Object.entries(player.ranks || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
                              const ratingsEntries = Object.entries(player.ratings || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
                              const notesEntries = Object.entries(player.notes || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
                              const positionsEntries = Object.entries(player.positions || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
                              const heightsEntries = Object.entries(player.heights || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
                              const highSchoolsEntries = Object.entries(player.highSchools || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
                              const circuitProgramsEntries = Object.entries(player.circuitPrograms || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
                              const committedCollegesEntries = Object.entries(player.committedColleges || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));

                              return (
                                <>
                          
                            <div className="flex justify-end mb-4">
                              <Link href={`/player/${player.id}`}>
                                <a className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-semibold hover-elevate active-elevate-2 px-3 py-2 rounded-md" data-testid={`link-player-detail-${player.id}`}>
                                  View Full Profile
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {ranksEntries.length > 0 && (
                                <div className="bg-muted/30 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="h-4 w-4 text-red-500" />
                                    <h4 className="font-semibold text-sm">Rankings History</h4>
                                  </div>
                                  <div className="space-y-2">
                                    {ranksEntries.map(([year, rank]) => (
                                      <div key={year} className="flex justify-between text-sm" data-testid={`expanded-rank-${player.id}-${year}`}>
                                        <span className="text-muted-foreground">Class {year}</span>
                                        <span className="font-bold text-red-500">#{rank}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {ratingsEntries.length > 0 && (
                                <div className="bg-muted/30 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <h4 className="font-semibold text-sm">Ratings History</h4>
                                  </div>
                                  <div className="space-y-2">
                                    {ratingsEntries.map(([year, rating]) => (
                                      <div key={year} className="flex justify-between text-sm" data-testid={`expanded-rating-${player.id}-${year}`}>
                                        <span className="text-muted-foreground">Class {year}</span>
                                        <span className="font-bold text-yellow-500">{rating}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {notesEntries.length > 0 && (
                                <div className="bg-muted/30 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <FileText className="h-4 w-4 text-red-500" />
                                    <h4 className="font-semibold text-sm">Scouting Notes</h4>
                                  </div>
                                  <div className="space-y-3">
                                    {notesEntries.slice(0, 2).map(([year, note]) => (
                                      <div key={year} className="text-xs" data-testid={`expanded-note-${player.id}-${year}`}>
                                        <div className="font-semibold text-red-500 mb-1">Class {year}</div>
                                        <p className="text-muted-foreground line-clamp-3">{note}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {(positionsEntries.length > 0 || heightsEntries.length > 0 || highSchoolsEntries.length > 0) && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {positionsEntries.length > 0 && (
                                  <div className="bg-muted/20 rounded-lg p-3">
                                    <h5 className="text-xs font-semibold mb-2 text-muted-foreground">Position History</h5>
                                    <div className="space-y-1">
                                      {positionsEntries.map(([year, position]) => (
                                        <div key={year} className="text-xs flex justify-between">
                                          <span className="text-muted-foreground">{year}</span>
                                          <Badge variant="outline" className="text-xs h-5">{position}</Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {heightsEntries.length > 0 && (
                                  <div className="bg-muted/20 rounded-lg p-3">
                                    <h5 className="text-xs font-semibold mb-2 text-muted-foreground">Height Records</h5>
                                    <div className="space-y-1">
                                      {heightsEntries.map(([year, height]) => (
                                        <div key={year} className="text-xs flex justify-between">
                                          <span className="text-muted-foreground">{year}</span>
                                          <span className="font-semibold">{height}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {highSchoolsEntries.length > 0 && (
                                  <div className="bg-muted/20 rounded-lg p-3">
                                    <h5 className="text-xs font-semibold mb-2 text-muted-foreground">School History</h5>
                                    <div className="space-y-1">
                                      {highSchoolsEntries.map(([year, school]) => (
                                        <div key={year} className="text-xs">
                                          <span className="text-muted-foreground">{year}:</span> {school}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {(circuitProgramsEntries.length > 0 || committedCollegesEntries.length > 0) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {circuitProgramsEntries.length > 0 && (
                                  <div className="bg-muted/20 rounded-lg p-3">
                                    <h5 className="text-xs font-semibold mb-2 text-muted-foreground">Circuit Programs</h5>
                                    <div className="space-y-1">
                                      {circuitProgramsEntries.map(([year, program]) => (
                                        <div key={year} className="text-xs">
                                          <span className="text-muted-foreground">{year}:</span> {program}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {committedCollegesEntries.length > 0 && (
                                  <div className="bg-muted/20 rounded-lg p-3">
                                    <h5 className="text-xs font-semibold mb-2 text-muted-foreground">Commitment History</h5>
                                    <div className="space-y-1">
                                      {committedCollegesEntries.map(([year, college]) => (
                                        <div key={year} className="text-xs">
                                          <span className="text-muted-foreground">{year}:</span> <span className="text-green-400">{college}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                                </>
                              );
                            })()}
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  );
                })}
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
                    data-testid="button-clear-all-filters"
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