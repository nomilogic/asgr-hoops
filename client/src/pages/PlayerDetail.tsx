import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Player, HighSchool, CircuitTeam, College } from "@shared/schema";
import { ArrowLeft, MapPin, School, Users, GraduationCap, Star, TrendingUp, FileText } from "lucide-react";

export default function PlayerDetail() {
  const [, params] = useRoute("/player/:id");
  const playerId = params?.id ? parseInt(params.id) : null;

  const { data: player, isLoading } = useQuery<Player>({
    queryKey: [`/api/players/${playerId}`],
    enabled: !!playerId,
  });

  const { data: highSchools } = useQuery<HighSchool[]>({
    queryKey: ["/api/high-schools"],
  });

  const { data: circuitTeams } = useQuery<CircuitTeam[]>({
    queryKey: ["/api/circuit-teams"],
  });

  const { data: colleges } = useQuery<College[]>({
    queryKey: ["/api/colleges"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <Skeleton className="h-96 w-full rounded-xl mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-not-found">Player Not Found</h1>
            <p className="text-muted-foreground mb-6">The player you're looking for doesn't exist.</p>
            <Link href="/rankings/2025">
              <a className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover-elevate active-elevate-2" data-testid="link-back-rankings">
                <ArrowLeft className="h-4 w-4" />
                Back to Rankings
              </a>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const highSchool = highSchools?.find(hs => hs.id === player.highSchoolId);
  const circuitTeam = circuitTeams?.find(ct => ct.id === player.circuitTeamId);
  const college = colleges?.find(c => c.id === player.committedCollegeId);

  const ranksEntries = Object.entries(player.ranks || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  const ratingsEntries = Object.entries(player.ratings || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  const notesEntries = Object.entries(player.notes || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  const positionsEntries = Object.entries(player.positions || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  const heightsEntries = Object.entries(player.heights || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  const highSchoolsEntries = Object.entries(player.highSchools || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  const circuitProgramsEntries = Object.entries(player.circuitPrograms || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  const committedCollegesEntries = Object.entries(player.committedColleges || {}).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-black via-red-950/30 to-black py-16 px-4 border-b border-red-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
          <div className="container mx-auto max-w-7xl relative z-10">
            <Link href={`/rankings/${player.gradeYear || 2025}`}>
              <a className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 hover-elevate active-elevate-2 px-3 py-2 rounded-md" data-testid="link-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Rankings
              </a>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col items-center">
                {player.imagePath ? (
                  <img
                    src={player.imagePath}
                    alt={player.name}
                    className="w-full max-w-sm h-auto object-cover rounded-lg border-2 border-red-900/30 shadow-2xl shadow-red-900/20"
                    data-testid="img-player"
                  />
                ) : (
                  <Avatar className="w-full max-w-sm h-96">
                    <AvatarFallback className="text-6xl bg-muted">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-start gap-4 mb-6">
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent" data-testid="text-player-name">
                    {player.name}
                  </h1>
                  {player.rank && (
                    <Badge className="text-2xl px-4 py-2 bg-gradient-to-br from-red-600 to-red-700 border-red-500/50" data-testid="badge-rank">
                      #{player.rank}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {player.gradeYear && (
                    <Card className="bg-card/50 border-card-border">
                      <CardContent className="p-4 text-center">
                        <GraduationCap className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold" data-testid="text-grad-year">{player.gradeYear}</div>
                        <div className="text-xs text-muted-foreground">Class</div>
                      </CardContent>
                    </Card>
                  )}
                  {player.position && (
                    <Card className="bg-card/50 border-card-border">
                      <CardContent className="p-4 text-center">
                        <Users className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold" data-testid="text-position">{player.position}</div>
                        <div className="text-xs text-muted-foreground">Position</div>
                      </CardContent>
                    </Card>
                  )}
                  {player.height && (
                    <Card className="bg-card/50 border-card-border">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold" data-testid="text-height">{player.height}</div>
                        <div className="text-xs text-muted-foreground">Height</div>
                      </CardContent>
                    </Card>
                  )}
                  {player.rating && (
                    <Card className="bg-card/50 border-card-border">
                      <CardContent className="p-4 text-center">
                        <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold" data-testid="text-rating">{player.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {player.highSchool && (
                    <Card className="bg-card/50 border-card-border">
                      <CardContent className="p-4 flex items-center gap-3">
                        <School className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="text-xs text-muted-foreground">High School</div>
                          <div className="font-semibold" data-testid="text-high-school">{player.highSchool}</div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {player.circuitProgram && (
                    <Card className="bg-card/50 border-card-border">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Users className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="text-xs text-muted-foreground">Circuit Program</div>
                          <div className="font-semibold" data-testid="text-circuit-program">{player.circuitProgram}</div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {player.state && (
                    <Card className="bg-card/50 border-card-border">
                      <CardContent className="p-4 flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="text-xs text-muted-foreground">State</div>
                          <div className="font-semibold" data-testid="text-state">{player.state}</div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {(player.committedCollege || college) && (
                    <Card className="bg-card/50 border-card-border bg-gradient-to-r from-green-950/20 to-card/50">
                      <CardContent className="p-4 flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-green-500" />
                        <div className="flex items-center gap-3 flex-1">
                          {college?.logoUrl && (
                            <img
                              src={college.logoUrl}
                              alt={college.name}
                              className="h-12 w-12 object-contain"
                            />
                          )}
                          <div>
                            <div className="text-xs text-green-400 font-semibold">Committed To</div>
                            <div className="font-bold text-green-400" data-testid="text-committed">{player.committedCollege || college?.name}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8" data-testid="tabs-list">
                <TabsTrigger value="history" data-testid="tab-history">Rankings History</TabsTrigger>
                <TabsTrigger value="stats" data-testid="tab-stats">Stats & Ratings</TabsTrigger>
                <TabsTrigger value="notes" data-testid="tab-notes">Scouting Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-6">
                <Card className="bg-card/50 border-card-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-red-500" />
                      Rankings Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ranksEntries.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ranksEntries.map(([year, rank]) => (
                          <div key={year} className="p-4 rounded-lg bg-muted/50 text-center" data-testid={`rank-${year}`}>
                            <div className="text-sm text-muted-foreground mb-1">Class {year}</div>
                            <div className="text-3xl font-bold text-red-500">#{rank}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No ranking history available</p>
                    )}
                  </CardContent>
                </Card>

                {positionsEntries.length > 0 && (
                  <Card className="bg-card/50 border-card-border">
                    <CardHeader>
                      <CardTitle>Position History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {positionsEntries.map(([year, position]) => (
                          <div key={year} className="flex justify-between items-center p-3 rounded-lg bg-muted/50" data-testid={`position-${year}`}>
                            <span className="text-muted-foreground">Class {year}</span>
                            <Badge variant="outline">{position}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {heightsEntries.length > 0 && (
                  <Card className="bg-card/50 border-card-border">
                    <CardHeader>
                      <CardTitle>Height Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {heightsEntries.map(([year, height]) => (
                          <div key={year} className="flex justify-between items-center p-3 rounded-lg bg-muted/50" data-testid={`height-${year}`}>
                            <span className="text-muted-foreground">Class {year}</span>
                            <span className="font-semibold">{height}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                {ratingsEntries.length > 0 && (
                  <Card className="bg-card/50 border-card-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Rating History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ratingsEntries.map(([year, rating]) => (
                          <div key={year} className="p-4 rounded-lg bg-muted/50 text-center" data-testid={`rating-${year}`}>
                            <div className="text-sm text-muted-foreground mb-1">Class {year}</div>
                            <div className="text-3xl font-bold text-yellow-500">{rating}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {highSchoolsEntries.length > 0 && (
                  <Card className="bg-card/50 border-card-border">
                    <CardHeader>
                      <CardTitle>High School History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {highSchoolsEntries.map(([year, school]) => (
                          <div key={year} className="flex justify-between items-center p-3 rounded-lg bg-muted/50" data-testid={`school-${year}`}>
                            <span className="text-muted-foreground">Class {year}</span>
                            <span className="font-semibold">{school}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {circuitProgramsEntries.length > 0 && (
                  <Card className="bg-card/50 border-card-border">
                    <CardHeader>
                      <CardTitle>Circuit Program History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {circuitProgramsEntries.map(([year, program]) => (
                          <div key={year} className="flex justify-between items-center p-3 rounded-lg bg-muted/50" data-testid={`circuit-${year}`}>
                            <span className="text-muted-foreground">Class {year}</span>
                            <span className="font-semibold">{program}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {committedCollegesEntries.length > 0 && (
                  <Card className="bg-card/50 border-card-border">
                    <CardHeader>
                      <CardTitle>College Commitment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {committedCollegesEntries.map(([year, college]) => (
                          <div key={year} className="flex justify-between items-center p-3 rounded-lg bg-muted/50" data-testid={`college-${year}`}>
                            <span className="text-muted-foreground">Class {year}</span>
                            <span className="font-semibold text-green-400">{college}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card className="bg-card/50 border-card-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-red-500" />
                      Scouting Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notesEntries.length > 0 ? (
                      <div className="space-y-4">
                        {notesEntries.map(([year, note]) => (
                          <div key={year} className="p-4 rounded-lg bg-muted/50 border border-border" data-testid={`note-${year}`}>
                            <div className="text-sm font-semibold text-red-500 mb-2">Class {year}</div>
                            <p className="text-sm text-foreground">{note}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No scouting notes available</p>
                    )}
                  </CardContent>
                </Card>

                {player.ratingComment && (
                  <Card className="bg-card/50 border-card-border">
                    <CardHeader>
                      <CardTitle>Current Rating Comment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm" data-testid="text-rating-comment">{player.ratingComment}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
