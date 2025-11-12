import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCircuitTeamSchema, type CircuitTeam } from "@shared/schema";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function AdminCircuitTeams() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<CircuitTeam | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<number | null>(null);
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Circuit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredTeams && filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <TableRow key={team.id} data-testid={`row-circuitteam-${team.id}`}>
                  <TableCell className="font-medium">{team.team}</TableCell>
                  <TableCell>{team.circuit || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditTeam(team)} data-testid={`button-edit-circuitteam-${team.id}`}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteTeamId(team.id)} data-testid={`button-delete-circuitteam-${team.id}`}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No circuit teams found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
