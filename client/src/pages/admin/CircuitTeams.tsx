
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCircuitTeamSchema, type CircuitTeam } from "@shared/schema";
import { Plus, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

export default function AdminCircuitTeams() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<CircuitTeam | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<number | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: teams, isLoading } = useQuery<CircuitTeam[]>({
    queryKey: ["/api/circuit-teams"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof insertCircuitTeamSchema._type) => {
      return await apiRequest("/api/admin/circuit-teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/circuit-teams"] });
      setIsCreateOpen(false);
      toast({ title: "Circuit team created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create circuit team", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof insertCircuitTeamSchema._type> }) => {
      return await apiRequest(`/api/admin/circuit-teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/circuit-teams"] });
      setEditTeam(null);
      toast({ title: "Circuit team updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update circuit team", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/circuit-teams/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/circuit-teams"] });
      setDeleteTeamId(null);
      toast({ title: "Circuit team deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete circuit team", variant: "destructive" });
    },
  });

  const filteredTeams = teams?.filter((team) =>
    team.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.circuit?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-circuitteams-title">Circuit Teams Management</h1>
          <p className="text-muted-foreground">Manage circuit teams and rankings</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-circuitteam">
              <Plus className="h-4 w-4 mr-2" />
              Add Circuit Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Circuit Team</DialogTitle>
            </DialogHeader>
            <TeamForm onSubmit={(data) => createMutation.mutate(data)} isPending={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search circuit teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          data-testid="input-search-circuitteams"
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredTeams && filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <Collapsible
              key={team.id}
              open={expandedTeamId === team.id}
              onOpenChange={(open) => setExpandedTeamId(open ? team.id : null)}
            >
              <Card data-testid={`card-circuitteam-${team.id}`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <CardTitle>{team.team}</CardTitle>
                          {team.circuit && (
                            <p className="text-sm text-muted-foreground mt-1">{team.circuit}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedTeamId === team.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="border-t pt-6">
                    <ExpandedTeamEdit
                      team={team}
                      onUpdate={(data) => updateMutation.mutate({ id: team.id, data })}
                      isPending={updateMutation.isPending}
                      onDelete={() => setDeleteTeamId(team.id)}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No circuit teams found
            </CardContent>
          </Card>
        )}
      </div>

      {editTeam && (
        <Dialog open={!!editTeam} onOpenChange={() => setEditTeam(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Circuit Team</DialogTitle>
            </DialogHeader>
            <TeamForm
              defaultValues={editTeam}
              onSubmit={(data) => updateMutation.mutate({ id: editTeam.id, data })}
              isPending={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deleteTeamId !== null} onOpenChange={() => setDeleteTeamId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Circuit Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this circuit team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTeamId && deleteMutation.mutate(deleteTeamId)} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ExpandedTeamEdit({ team, onUpdate, isPending, onDelete }: {
  team: CircuitTeam;
  onUpdate: (data: Partial<CircuitTeam>) => void;
  isPending: boolean;
  onDelete: () => void;
}) {
  const [localTeam, setLocalTeam] = useState(team);
  const seasons = ["2024 Circuit Season", "2025 Circuit Season", "2026 Circuit Season"];

  const handleSeasonDataUpdate = (field: keyof CircuitTeam, season: string, value: string) => {
    const currentData = (localTeam[field] as Record<string, any>) || {};
    const updatedData = { ...currentData, [season]: value };
    setLocalTeam({ ...localTeam, [field]: updatedData });
  };

  const handleSave = () => {
    onUpdate(localTeam);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Team Name</label>
          <Input
            value={localTeam.team}
            onChange={(e) => setLocalTeam({ ...localTeam, team: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Circuit</label>
          <Input
            value={localTeam.circuit || ""}
            onChange={(e) => setLocalTeam({ ...localTeam, circuit: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        {seasons.map((season) => (
          <Card key={season}>
            <CardHeader>
              <CardTitle className="text-lg">{season}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rank</label>
                <Input
                  type="number"
                  placeholder="Ranking"
                  value={(localTeam.ranks as Record<string, number>)?.[season] || ""}
                  onChange={(e) => handleSeasonDataUpdate('ranks', season, e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Record</label>
                <Input
                  placeholder="e.g., 25-3"
                  value={(localTeam.records as Record<string, string>)?.[season] || ""}
                  onChange={(e) => handleSeasonDataUpdate('records', season, e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Key Wins</label>
                <Textarea
                  placeholder="Notable victories and achievements..."
                  value={(localTeam.keyWins as Record<string, string>)?.[season] || ""}
                  onChange={(e) => handleSeasonDataUpdate('keyWins', season, e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Placements</label>
                <Input
                  placeholder="Tournament placements"
                  value={(localTeam.placements as Record<string, string>)?.[season] || ""}
                  onChange={(e) => handleSeasonDataUpdate('placements', season, e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeamForm({ defaultValues, onSubmit, isPending }: {
  defaultValues?: Partial<CircuitTeam>;
  onSubmit: (data: typeof insertCircuitTeamSchema._type) => void;
  isPending: boolean;
}) {
  const form = useForm({
    resolver: zodResolver(insertCircuitTeamSchema),
    defaultValues: {
      team: defaultValues?.team || "",
      circuit: defaultValues?.circuit || "",
      ranks: defaultValues?.ranks || {},
      records: defaultValues?.records || {},
      keyWins: defaultValues?.keyWins || {},
      placements: defaultValues?.placements || {},
      sourceUrls: defaultValues?.sourceUrls || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name*</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-circuitteam-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="circuit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circuit</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} data-testid="input-circuitteam-circuit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isPending} data-testid="button-submit-circuitteam">
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
