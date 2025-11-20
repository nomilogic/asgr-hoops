import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHighSchoolSchema, type HighSchool } from "@shared/schema";
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

export default function AdminHighSchools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editSchool, setEditSchool] = useState<HighSchool | null>(null);
  const [deleteSchoolId, setDeleteSchoolId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [expandedSchoolId, setExpandedSchoolId] = useState<number | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

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

  const { data: schools, isLoading } = useQuery<HighSchool[]>({
    queryKey: ["/api/high-schools"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof insertHighSchoolSchema._type) => {
      return await apiRequest("/api/admin/high-schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/high-schools"] });
      setIsCreateOpen(false);
      toast({ title: "High school created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create high school", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof insertHighSchoolSchema._type> }) => {
      return await apiRequest(`/api/admin/high-schools/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/high-schools"] });
      setEditSchool(null);
      toast({ title: "High school updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update high school", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/high-schools/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/high-schools"] });
      setDeleteSchoolId(null);
      toast({ title: "High school deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete high school", variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`/api/admin/high-schools/${id}/logo`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload logo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/high-schools"] });
      toast({ title: "Logo uploaded successfully" });
      setUploadingImage(null);
      setImageFile(null);
    },
    onError: () => {
      toast({ title: "Failed to upload logo", variant: "destructive" });
    },
  });

  const handleImageUpload = (schoolId: number) => {
    if (imageFile) {
      uploadImageMutation.mutate({ id: schoolId, file: imageFile });
    }
  };

  const filteredSchools = schools?.filter((school) =>
    school.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-highschools-title">High Schools Management</h1>
          <p className="text-muted-foreground">Manage high school rankings and records</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-highschool">
              <Plus className="h-4 w-4 mr-2" />
              Add High School
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New High School</DialogTitle>
            </DialogHeader>
            <SchoolForm onSubmit={(data) => createMutation.mutate(data)} isPending={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search high schools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          data-testid="input-search-highschools"
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
        ) : filteredSchools && filteredSchools.length > 0 ? (
          filteredSchools.map((school) => (
            <Collapsible
              key={school.id}
              open={expandedSchoolId === school.id}
              onOpenChange={(open) => setExpandedSchoolId(open ? school.id : null)}
            >
              <Card data-testid={`card-highschool-${school.id}`} className="relative group overflow-hidden">
                <div className="absolute inset-0 rounded-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(173,216,230,0.7)]"></div>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={school.logoPath || undefined} />
                          <AvatarFallback>
                            <ImageIcon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{school.school}</CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedSchoolId === school.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="border-t pt-6 relative z-10">
                    <ExpandedSchoolEdit
                      school={school}
                      onUpdate={(data) => updateMutation.mutate({ id: school.id, data })}
                      isPending={updateMutation.isPending}
                      onDelete={() => setDeleteSchoolId(school.id)}
                      onUploadImage={() => setUploadingImage(school.id)}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No high schools found
            </CardContent>
          </Card>
        )}
      </div>

      {uploadingImage && (
        <Dialog open={uploadingImage !== null} onOpenChange={() => setUploadingImage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload School Logo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={() => uploadingImage && handleImageUpload(uploadingImage)}
                disabled={!imageFile || uploadImageMutation.isPending}
                className="w-full"
              >
                {uploadImageMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editSchool && (
        <Dialog open={!!editSchool} onOpenChange={() => setEditSchool(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit High School</DialogTitle>
            </DialogHeader>
            <SchoolForm
              defaultValues={editSchool}
              onSubmit={(data) => updateMutation.mutate({ id: editSchool.id, data })}
              isPending={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deleteSchoolId !== null} onOpenChange={() => setDeleteSchoolId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete High School</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this high school? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteSchoolId && deleteMutation.mutate(deleteSchoolId)} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ExpandedSchoolEdit({ school, onUpdate, isPending, onDelete, onUploadImage }: {
  school: HighSchool;
  onUpdate: (data: Partial<HighSchool>) => void;
  isPending: boolean;
  onDelete: () => void;
  onUploadImage: () => void;
}) {
  const [localSchool, setLocalSchool] = useState(school);
  const seasons = ["2023-24", "2024-25", "2025-26", "2026-27", "2027-28"];

  const handleSeasonDataUpdate = (field: keyof HighSchool, season: string, value: string) => {
    const currentData = (localSchool[field] as Record<string, any>) || {};
    const updatedData = { ...currentData, [season]: value };
    setLocalSchool({ ...localSchool, [field]: updatedData });
  };

  const handleSave = () => {
    onUpdate(localSchool);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onUploadImage}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Logo
        </Button>
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
          <label className="text-sm font-medium">School Name</label>
          <Input
            value={localSchool.school}
            onChange={(e) => setLocalSchool({ ...localSchool, school: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Logo Path</label>
          <Input
            value={localSchool.logoPath || ""}
            onChange={(e) => setLocalSchool({ ...localSchool, logoPath: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rankings by Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {seasons.map((season) => (
                <div key={season} className="relative group">
                  <label className="text-sm font-medium">{season}</label>
                  <Input
                    type="number"
                    placeholder="Rank"
                    value={(localSchool.ranks as Record<string, number>)?.[season] || ""}
                    onChange={(e) => handleSeasonDataUpdate('ranks', season, e.target.value)}
                    className="peer"
                  />
                  <div className="absolute inset-0 rounded-md transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(173,216,230,0.7)] peer-focus:shadow-[0_0_15px_rgba(173,216,230,0.7)] pointer-events-none"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Records by Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasons.map((season) => (
                <div key={season}>
                  <label className="text-sm font-medium">{season}</label>
                  <Input
                    placeholder="e.g., 25-3"
                    value={(localSchool.records as Record<string, string>)?.[season] || ""}
                    onChange={(e) => handleSeasonDataUpdate('records', season, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Wins by Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seasons.map((season) => (
                <div key={season}>
                  <label className="text-sm font-medium">{season}</label>
                  <Textarea
                    placeholder="Key wins and achievements..."
                    value={(localSchool.keyWins as Record<string, string>)?.[season] || ""}
                    onChange={(e) => handleSeasonDataUpdate('keyWins', season, e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SchoolForm({ defaultValues, onSubmit, isPending }: {
  defaultValues?: Partial<HighSchool>;
  onSubmit: (data: typeof insertHighSchoolSchema._type) => void;
  isPending: boolean;
}) {
  const form = useForm({
    resolver: zodResolver(insertHighSchoolSchema),
    defaultValues: {
      school: defaultValues?.school || "",
      logoPath: defaultValues?.logoPath || "",
      ranks: defaultValues?.ranks || {},
      records: defaultValues?.records || {},
      keyWins: defaultValues?.keyWins || {},
      sourceUrls: defaultValues?.sourceUrls || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name*</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-highschool-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logoPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo Path</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} data-testid="input-highschool-logo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isPending} data-testid="button-submit-highschool">
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}