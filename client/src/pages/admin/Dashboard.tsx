
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Trophy, Star, Package, UserCog, TrendingUp, Activity, Award, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: recentPlayers } = useQuery({
    queryKey: ["/api/players"],
    select: (data) => data.slice(0, 5),
  });

  const { data: recentSchools } = useQuery({
    queryKey: ["/api/high-schools"],
    select: (data) => data.slice(0, 5),
  });

  const { data: recentTeams } = useQuery({
    queryKey: ["/api/circuit-teams"],
    select: (data) => data.slice(0, 5),
  });

  const statCards = [
    {
      title: "Total Players",
      value: stats?.playersCount ?? 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Registered athletes",
      link: "/admin/players",
    },
    {
      title: "High Schools",
      value: stats?.highSchoolsCount ?? 0,
      icon: School,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Partner schools",
      link: "/admin/high-schools",
    },
    {
      title: "Circuit Teams",
      value: stats?.circuitTeamsCount ?? 0,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Active teams",
      link: "/admin/circuit-teams",
    },
    {
      title: "Colleges",
      value: stats?.collegesCount ?? 0,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Partner colleges",
      link: "/admin/colleges",
    },
    {
      title: "Products",
      value: stats?.productsCount ?? 0,
      icon: Package,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Available services",
      link: "/admin/products",
    },
    {
      title: "Users",
      value: stats?.usersCount ?? 0,
      icon: UserCog,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Registered users",
      link: "/admin/users",
    },
  ];

  const rankingTypes = [
    {
      title: "Player Rankings",
      years: ["2024", "2025", "2026", "2027", "2028", "2029", "2030"],
      icon: Award,
      color: "text-blue-600",
      link: "/admin/players",
    },
    {
      title: "High School Rankings",
      seasons: ["2024-25", "2023-24"],
      icon: School,
      color: "text-green-600",
      link: "/admin/high-schools",
    },
    {
      title: "Circuit Rankings",
      year: "2024 Circuit Season",
      icon: Trophy,
      color: "text-yellow-600",
      link: "/admin/circuit-teams",
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load dashboard statistics. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-admin-title">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete overview and management of ASGR platform
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <Activity className="h-4 w-4 mr-2" />
          Platform Active
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <a>
              <Card 
                data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div 
                        className="text-2xl font-bold" 
                        data-testid={`text-count-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {stat.value.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>

      {/* Rankings Management Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {rankingTypes.map((ranking) => (
          <Card key={ranking.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ranking.icon className={`h-5 w-5 ${ranking.color}`} />
                {ranking.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ranking.years && (
                <div className="flex flex-wrap gap-2">
                  {ranking.years.map((year) => (
                    <Badge key={year} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Class of {year}
                    </Badge>
                  ))}
                </div>
              )}
              {ranking.seasons && (
                <div className="flex flex-wrap gap-2">
                  {ranking.seasons.map((season) => (
                    <Badge key={season} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {season}
                    </Badge>
                  ))}
                </div>
              )}
              {ranking.year && (
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {ranking.year}
                </Badge>
              )}
              <Link href={ranking.link}>
                <a>
                  <Button className="w-full mt-2" variant="outline">
                    Manage Rankings
                  </Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats and Recent Activity */}
      {!isLoading && stats && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Platform Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                <span className="text-sm text-muted-foreground">Athletes per School</span>
                <span className="font-semibold text-lg">
                  {stats.highSchoolsCount > 0 
                    ? (stats.playersCount / stats.highSchoolsCount).toFixed(1)
                    : '0'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                <span className="text-sm text-muted-foreground">Teams per College</span>
                <span className="font-semibold text-lg">
                  {stats.collegesCount > 0 
                    ? (stats.circuitTeamsCount / stats.collegesCount).toFixed(1)
                    : '0'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                <span className="text-sm text-muted-foreground">Total Entities</span>
                <span className="font-semibold text-lg">
                  {(stats.playersCount + stats.highSchoolsCount + stats.circuitTeamsCount + stats.collegesCount).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/players">
                <a>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Add New Player
                  </Button>
                </a>
              </Link>
              <Link href="/admin/high-schools">
                <a>
                  <Button className="w-full justify-start" variant="outline">
                    <School className="h-4 w-4 mr-2" />
                    Add New High School
                  </Button>
                </a>
              </Link>
              <Link href="/admin/circuit-teams">
                <a>
                  <Button className="w-full justify-start" variant="outline">
                    <Trophy className="h-4 w-4 mr-2" />
                    Add New Circuit Team
                  </Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity Section */}
      {(recentPlayers || recentSchools || recentTeams) && (
        <div className="grid gap-4 md:grid-cols-3">
          {recentPlayers && recentPlayers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Recent Players
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentPlayers.map((player: any) => (
                  <div key={player.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{player.name}</p>
                      <p className="text-xs text-muted-foreground">Class of {player.gradeYear}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {recentSchools && recentSchools.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Recent High Schools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentSchools.map((school: any) => (
                  <div key={school.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <School className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{school.school}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {recentTeams && recentTeams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Recent Circuit Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentTeams.map((team: any) => (
                  <div key={team.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{team.team}</p>
                      <p className="text-xs text-muted-foreground">{team.circuit}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
