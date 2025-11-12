import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Trophy, Star, Package, UserCog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const statCards = [
    {
      title: "Players",
      value: stats?.playersCount ?? 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "High Schools",
      value: stats?.highSchoolsCount ?? 0,
      icon: School,
      color: "text-green-600",
    },
    {
      title: "Circuit Teams",
      value: stats?.circuitTeamsCount ?? 0,
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: "Colleges",
      value: stats?.collegesCount ?? 0,
      icon: Star,
      color: "text-purple-600",
    },
    {
      title: "Products",
      value: stats?.productsCount ?? 0,
      icon: Package,
      color: "text-pink-600",
    },
    {
      title: "Users",
      value: stats?.usersCount ?? 0,
      icon: UserCog,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-admin-title">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all content from one place</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid={`text-count-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {stat.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
