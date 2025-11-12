
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Trophy, Star, Package, UserCog, TrendingUp, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/stats"],
  });

  const statCards = [
    {
      title: "Total Players",
      value: stats?.playersCount ?? 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Registered athletes",
    },
    {
      title: "High Schools",
      value: stats?.highSchoolsCount ?? 0,
      icon: School,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Partner schools",
    },
    {
      title: "Circuit Teams",
      value: stats?.circuitTeamsCount ?? 0,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "Active teams",
    },
    {
      title: "Colleges",
      value: stats?.collegesCount ?? 0,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Partner colleges",
    },
    {
      title: "Products",
      value: stats?.productsCount ?? 0,
      icon: Package,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Available services",
    },
    {
      title: "Users",
      value: stats?.usersCount ?? 0,
      icon: UserCog,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Registered users",
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
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-admin-title">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of your ASGR platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}
            className="hover:shadow-lg transition-shadow"
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
        ))}
      </div>

      {!isLoading && stats && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Athletes per School</span>
                <span className="font-semibold">
                  {stats.highSchoolsCount > 0 
                    ? (stats.playersCount / stats.highSchoolsCount).toFixed(1)
                    : '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Teams per College</span>
                <span className="font-semibold">
                  {stats.collegesCount > 0 
                    ? (stats.circuitTeamsCount / stats.collegesCount).toFixed(1)
                    : '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Entities</span>
                <span className="font-semibold">
                  {(stats.playersCount + stats.highSchoolsCount + stats.circuitTeamsCount + stats.collegesCount).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Products</span>
                <span className="font-semibold">{stats.productsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registered Users</span>
                <span className="font-semibold">{stats.usersCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Platform Health</span>
                <span className="font-semibold text-green-600">Excellent</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
