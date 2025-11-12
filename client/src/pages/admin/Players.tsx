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
import { insertPlayerSchema, type Player } from "@shared/schema";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const playerFormSchema = insertPlayerSchema.extend({
  gradeYear: z.coerce.number().nullable(),
  rank: z.coerce.number().nullable(),
  rating: z.coerce.number().nullable(),
});

export default function AdminPlayers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [deletePlayerId, setDeletePlayerId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof playerFormSchema>) => {
      return await apiRequest("/api/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      setIsCreateOpen(false);
      toast({ title: "Player created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create player", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<z.infer<typeof playerFormSchema>> }) => {
      return await apiRequest(`/api/admin/players/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      setEditPlayer(null);
      toast({ title: "Player updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update player", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/players/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      setDeletePlayerId(null);
      toast({ title: "Player deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete player", variant: "destructive" });
    },
  });

  const filteredPlayers = players?.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.highSchool?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.committedCollege?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-players-title">Players Management</h1>
          <p className="text-muted-foreground">Manage player profiles and rankings</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-player">
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Player</DialogTitle>
            </DialogHeader>
            <PlayerForm onSubmit={(data) => createMutation.mutate(data)} isPending={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          data-testid="input-search-players"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>High School</TableHead>
              <TableHead>Committed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredPlayers && filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <TableRow key={player.id} data-testid={`row-player-${player.id}`}>
                  <TableCell>{player.rank || "-"}</TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.gradeYear || "-"}</TableCell>
                  <TableCell>{player.position || "-"}</TableCell>
                  <TableCell>{player.highSchool || "-"}</TableCell>
                  <TableCell>{player.committedCollege || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditPlayer(player)} data-testid={`button-edit-player-${player.id}`}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeletePlayerId(player.id)} data-testid={`button-delete-player-${player.id}`}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No players found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editPlayer && (
        <Dialog open={!!editPlayer} onOpenChange={() => setEditPlayer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
            </DialogHeader>
            <PlayerForm
              defaultValues={editPlayer}
              onSubmit={(data) => updateMutation.mutate({ id: editPlayer.id, data })}
              isPending={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deletePlayerId !== null} onOpenChange={() => setDeletePlayerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Player</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this player? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePlayerId && deleteMutation.mutate(deletePlayerId)} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PlayerForm({ defaultValues, onSubmit, isPending }: {
  defaultValues?: Partial<Player>;
  onSubmit: (data: z.infer<typeof playerFormSchema>) => void;
  isPending: boolean;
}) {
  const form = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      rank: defaultValues?.rank || null,
      gradeYear: defaultValues?.gradeYear || null,
      position: defaultValues?.position || "",
      height: defaultValues?.height || "",
      highSchool: defaultValues?.highSchool || "",
      circuitProgram: defaultValues?.circuitProgram || "",
      state: defaultValues?.state || "",
      committedCollege: defaultValues?.committedCollege || "",
      rating: defaultValues?.rating || null,
      ratingComment: defaultValues?.ratingComment || "",
      imagePath: defaultValues?.imagePath || "",
      ranks: defaultValues?.ranks || {},
      ratings: defaultValues?.ratings || {},
      notes: defaultValues?.notes || {},
      positions: defaultValues?.positions || {},
      heights: defaultValues?.heights || {},
      highSchools: defaultValues?.highSchools || {},
      circuitPrograms: defaultValues?.circuitPrograms || {},
      committedColleges: defaultValues?.committedColleges || {},
      sourceUrls: defaultValues?.sourceUrls || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input {...field} data-testid="input-player-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rank</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    data-testid="input-player-rank"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gradeYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    data-testid="input-player-year"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} data-testid="input-player-position" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="e.g., 5'10" data-testid="input-player-height" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} data-testid="input-player-state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="highSchool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>High School</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} data-testid="input-player-highschool" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="circuitProgram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circuit Program</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} data-testid="input-player-circuit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="committedCollege"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Committed College</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} data-testid="input-player-college" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isPending} data-testid="button-submit-player">
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
