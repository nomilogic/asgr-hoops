import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlayerSchema, type Player } from "@shared/schema";
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const playerFormSchema = insertPlayerSchema.extend({
  gradeYear: z.coerce.number().nullable(),
  rank: z.coerce.number().nullable(),
  rating: z.coerce.number().nullable(),
  committedCollegeId: z.number().nullable(), // Add this for the new college selection
});

export default function AdminPlayers() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [deletePlayerId, setDeletePlayerId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You must be an admin to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: players, isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const { data: colleges, isLoading: collegesLoading } = useQuery<{ id: number; name: string; logoPath: string | null }[]>({
    queryKey: ["/api/admin/colleges"],
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
      setExpandedPlayerId(null);
      toast({ title: "Player updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update player", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/players/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete player");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({ title: "Player deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete player", variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`/api/admin/players/${id}/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload image");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({ title: "Image uploaded successfully" });
      setUploadingImage(null);
      setImageFile(null);
    },
    onError: () => {
      toast({ title: "Failed to upload image", variant: "destructive" });
    },
  });

  const handleImageUpload = (playerId: number) => {
    if (imageFile) {
      uploadImageMutation.mutate({ id: playerId, file: imageFile });
    }
  };

  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

  const filteredPlayers = players?.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.highSchool?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.committedCollege?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear = !selectedYear || player.gradeYear?.toString() === selectedYear;

    return matchesSearch && matchesYear;
  });

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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Player</DialogTitle>
            </DialogHeader>
            <PlayerForm onSubmit={(data) => createMutation.mutate(data)} isPending={createMutation.isPending} colleges={colleges} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            data-testid="input-search-players"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Class:</span>
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Button>
          ))}
          <Button
            variant={!selectedYear ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedYear("")}
          >
            All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {playersLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredPlayers && filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <Collapsible
              key={player.id}
              open={expandedPlayerId === player.id}
              onOpenChange={(open) => setExpandedPlayerId(open ? player.id : null)}
            >
              <Card data-testid={`card-player-${player.id}`} className="group relative">
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary group-hover:shadow-glow transition-all duration-300 pointer-events-none"></div>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={player.imagePath || undefined} />
                          <AvatarFallback>
                            <ImageIcon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{player.name}</CardTitle>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant="secondary">{player.gradeYear || "N/A"}</Badge>
                            <Badge variant={player.rank ? "default" : "outline"}>
                              Rank: {player.ranks?.[selectedYear] || player.rank || "-"}
                            </Badge>
                            {player.position && <Badge variant="outline">{player.position}</Badge>}
                            {player.height && <Badge variant="outline">{player.height}</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedPlayerId === player.id ? (
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
                    <ExpandedPlayerEdit
                      player={player}
                      colleges={colleges}
                      onUpdate={(data) => updateMutation.mutate({ id: player.id, data })}
                      isPending={updateMutation.isPending}
                      onDelete={() => setDeletePlayerId(player.id)}
                      onUploadImage={() => setUploadingImage(player.id)}
                      setImageFile={setImageFile}
                      imageFile={imageFile}
                      uploadingImage={uploadingImage}
                      handleImageUpload={handleImageUpload}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No players found
            </CardContent>
          </Card>
        )}
      </div>

      {uploadingImage && (
        <Dialog open={uploadingImage !== null} onOpenChange={() => setUploadingImage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Player Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={() => handleImageUpload(uploadingImage)}
                disabled={!imageFile || uploadImageMutation.isPending}
                className="w-full"
              >
                {uploadImageMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
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

interface ExpandedPlayerEditProps {
  player: Player;
  colleges: { id: number; name: string; logoPath: string | null }[] | undefined;
  onUpdate: (data: Partial<Player>) => void;
  isPending: boolean;
  onDelete: () => void;
  onUploadImage: () => void;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageFile: File | null;
  uploadingImage: number | null;
  handleImageUpload: (playerId: number) => void;
}

function ExpandedPlayerEdit({
  player,
  colleges,
  onUpdate,
  isPending,
  onDelete,
  onUploadImage,
  setImageFile,
  imageFile,
  uploadingImage,
  handleImageUpload,
}: ExpandedPlayerEditProps) {
  const [localPlayer, setLocalPlayer] = useState(player);
  const [lists, setLists] = useState<string[]>(() => {
    const allLists = new Set<string>();

    [player.ranks, player.ratings, player.notes, player.positions, player.heights,
     player.highSchools, player.circuitPrograms, player.committedColleges].forEach(field => {
      if (field && typeof field === 'object') {
        Object.keys(field).forEach(key => allLists.add(key));
      }
    });

    if (allLists.size === 0) {
      return ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];
    }

    return Array.from(allLists).sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum;
      return a.localeCompare(b);
    });
  });
  const [newListName, setNewListName] = useState("");

  const handleYearDataUpdate = (field: keyof Player, year: string, value: string | number | null) => {
    const currentData = (localPlayer[field] as Record<string, any>) || {};
    const updatedData = { ...currentData, [year]: value };
    setLocalPlayer({ ...localPlayer, [field]: updatedData });
  };

  const handleAddList = () => {
    if (newListName && !lists.includes(newListName)) {
      setLists([...lists, newListName].sort((a, b) => {
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum;
        return a.localeCompare(b);
      }));
      setNewListName("");
    }
  };

  const handleRemoveList = (listToRemove: string) => {
    const fields: (keyof Player)[] = ['ranks', 'ratings', 'notes', 'positions', 'heights', 'highSchools', 'circuitPrograms', 'committedColleges'];
    const updates: Partial<Player> = {};

    fields.forEach(field => {
      const data = { ...(localPlayer[field] as Record<string, any>) };
      delete data[listToRemove];
      updates[field] = data as any;
    });

    setLocalPlayer({ ...localPlayer, ...updates });
    setLists(lists.filter(l => l !== listToRemove));
  };

  const handleSave = () => {
    onUpdate(localPlayer);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onUploadImage}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
        <Button variant="outline" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={localPlayer.name}
              onChange={(e) => setLocalPlayer({ ...localPlayer, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Grade Year</label>
            <Input
              type="number"
              value={localPlayer.gradeYear || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, gradeYear: parseInt(e.target.value) || null })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Current Rank</label>
            <Input
              type="number"
              value={localPlayer.rank || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, rank: parseInt(e.target.value) || null })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Current Rating</label>
            <Input
              type="number"
              value={localPlayer.rating || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, rating: parseInt(e.target.value) || null })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Position</label>
            <Input
              value={localPlayer.position || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, position: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Height</label>
            <Input
              value={localPlayer.height || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, height: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">High School</label>
            <Input
              value={localPlayer.highSchool || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, highSchool: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Circuit Program</label>
            <Input
              value={localPlayer.circuitProgram || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, circuitProgram: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">State</label>
            <Input
              value={localPlayer.state || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, state: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Committed College</label>
            <Select
              value={localPlayer.committedCollegeId?.toString() || ""}
              onValueChange={(value) => {
                const collegeId = value ? parseInt(value) : null;
                const college = colleges?.find(c => c.id === collegeId);
                setLocalPlayer({
                  ...localPlayer,
                  committedCollegeId: collegeId,
                  committedCollege: college?.name || null
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a college" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No commitment</SelectItem>
                {colleges?.map((college) => (
                  <SelectItem key={college.id} value={college.id.toString()}>
                    <div className="flex items-center gap-2">
                      {college.logoPath && (
                        <img src={college.logoPath} alt={college.name} className="w-6 h-6 object-contain" />
                      )}
                      {college.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {localPlayer.committedCollegeId && colleges && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                {(() => {
                  const college = colleges.find(c => c.id === localPlayer.committedCollegeId);
                  return college?.logoPath ? (
                    <>
                      <img src={college.logoPath} alt={college.name} className="w-8 h-8 object-contain" />
                      <span>{college.name}</span>
                    </>
                  ) : null;
                })()}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Upload Player Image</label>
            <div className="flex gap-2 mt-1">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={() => handleImageUpload(player.id)}
                disabled={!imageFile || uploadingImage === player.id}
                variant="outline"
              >
                {uploadingImage === player.id ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Rating Comment</label>
            <Textarea
              value={localPlayer.ratingComment || ""}
              onChange={(e) => setLocalPlayer({ ...localPlayer, ratingComment: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Custom Lists & Year-by-Year Data</h3>
          <div className="flex gap-2 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium">Add New List</label>
              <Input
                placeholder="e.g., 2031, Top Prospects, Elite 8"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
              />
            </div>
            <Button onClick={handleAddList} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add List
            </Button>
          </div>
        </div>
        {lists.map((year) => (
          <Card key={year}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{year}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveList(year)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Rank</label>
                  <Input
                    type="number"
                    placeholder="Rank"
                    value={(localPlayer.ranks as Record<string, number>)?.[year] || ""}
                    onChange={(e) => handleYearDataUpdate('ranks', year, parseInt(e.target.value) || null)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <Input
                    type="number"
                    placeholder="Rating"
                    value={(localPlayer.ratings as Record<string, number>)?.[year] || ""}
                    onChange={(e) => handleYearDataUpdate('ratings', year, parseInt(e.target.value) || null)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Position</label>
                  <Input
                    placeholder="Position"
                    value={(localPlayer.positions as Record<string, string>)?.[year] || ""}
                    onChange={(e) => handleYearDataUpdate('positions', year, e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Height</label>
                  <Input
                    placeholder="Height"
                    value={(localPlayer.heights as Record<string, string>)?.[year] || ""}
                    onChange={(e) => handleYearDataUpdate('heights', year, e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">High School</label>
                  <Input
                    placeholder="High School"
                    value={(localPlayer.highSchools as Record<string, string>)?.[year] || ""}
                    onChange={(e) => handleYearDataUpdate('highSchools', year, e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Circuit Program</label>
                  <Input
                    placeholder="Circuit Program"
                    value={(localPlayer.circuitPrograms as Record<string, string>)?.[year] || ""}
                    onChange={(e) => handleYearDataUpdate('circuitPrograms', year, e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium">College Commitment</label>
                  <Input
                    placeholder="College"
                    value={(localPlayer.committedColleges as Record<string, string>)?.[year] || ""}
                    onChange={(e) => handleYearDataUpdate('committedColleges', year, e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium">Scouting Notes</label>
                  <Textarea
                    placeholder="Scouting notes..."
                    value={(localPlayer.notes as Record<string, string>)?.[year] || ""}
                    onChange={(e) => handleYearDataUpdate('notes', year, e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PlayerForm({ defaultValues, onSubmit, isPending, colleges }: {
  defaultValues?: Partial<Player>;
  onSubmit: (data: z.infer<typeof playerFormSchema>) => void;
  isPending: boolean;
  colleges: { id: number; name: string; logoPath: string | null }[] | undefined;
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
      committedCollegeId: defaultValues?.committedCollegeId || null,
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
        </div>

        <div className="grid grid-cols-3 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          name="committedCollegeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Committed College</FormLabel>
              <Select
                value={field.value?.toString() || ""}
                onValueChange={(value) => {
                  const collegeId = value ? parseInt(value) : null;
                  const college = colleges?.find(c => c.id === collegeId);
                  field.onChange(collegeId);
                  form.setValue("committedCollege", college?.name || "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a college" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No commitment</SelectItem>
                  {colleges?.map((college) => (
                    <SelectItem key={college.id} value={college.id.toString()}>
                      <div className="flex items-center gap-2">
                        {college.logoPath && (
                          <img src={college.logoPath} alt={college.name} className="w-6 h-6 object-contain" />
                        )}
                        {college.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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