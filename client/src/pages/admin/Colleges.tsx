
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCollegeSchema, type College } from "@shared/schema";
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

export default function AdminColleges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCollege, setEditCollege] = useState<College | null>(null);
  const [deleteCollegeId, setDeleteCollegeId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [expandedCollegeId, setExpandedCollegeId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: colleges, isLoading } = useQuery<College[]>({
    queryKey: ["/api/colleges"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof insertCollegeSchema._type) => {
      return await apiRequest("/api/admin/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/colleges"] });
      setIsCreateOpen(false);
      toast({ title: "College created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create college", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof insertCollegeSchema._type> }) => {
      return await apiRequest(`/api/admin/colleges/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/colleges"] });
      setEditCollege(null);
      toast({ title: "College updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update college", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/colleges/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/colleges"] });
      setDeleteCollegeId(null);
      toast({ title: "College deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete college", variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`/api/admin/colleges/${id}/logo`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload logo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/colleges"] });
      toast({ title: "Logo uploaded successfully" });
      setUploadingImage(null);
      setImageFile(null);
    },
    onError: () => {
      toast({ title: "Failed to upload logo", variant: "destructive" });
    },
  });

  const handleImageUpload = (collegeId: number) => {
    if (imageFile) {
      uploadImageMutation.mutate({ id: collegeId, file: imageFile });
    }
  };

  const filteredColleges = colleges?.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-colleges-title">Colleges Management</h1>
          <p className="text-muted-foreground">Manage college commitments and recruiting data</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-college">
              <Plus className="h-4 w-4 mr-2" />
              Add College
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New College</DialogTitle>
            </DialogHeader>
            <CollegeForm onSubmit={(data) => createMutation.mutate(data)} isPending={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search colleges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          data-testid="input-search-colleges"
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
        ) : filteredColleges && filteredColleges.length > 0 ? (
          filteredColleges.map((college) => (
            <Collapsible
              key={college.id}
              open={expandedCollegeId === college.id}
              onOpenChange={(open) => setExpandedCollegeId(open ? college.id : null)}
            >
              <Card data-testid={`card-college-${college.id}`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={college.logoPath || undefined} />
                          <AvatarFallback>
                            <ImageIcon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{college.name}</CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedCollegeId === college.id ? (
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
                    <ExpandedCollegeEdit
                      college={college}
                      onUpdate={(data) => updateMutation.mutate({ id: college.id, data })}
                      isPending={updateMutation.isPending}
                      onDelete={() => setDeleteCollegeId(college.id)}
                      onUploadImage={() => setUploadingImage(college.id)}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No colleges found
            </CardContent>
          </Card>
        )}
      </div>

      {uploadingImage && (
        <Dialog open={uploadingImage !== null} onOpenChange={() => setUploadingImage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload College Logo</DialogTitle>
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

      {editCollege && (
        <Dialog open={!!editCollege} onOpenChange={() => setEditCollege(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit College</DialogTitle>
            </DialogHeader>
            <CollegeForm
              defaultValues={editCollege}
              onSubmit={(data) => updateMutation.mutate({ id: editCollege.id, data })}
              isPending={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={deleteCollegeId !== null} onOpenChange={() => setDeleteCollegeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete College</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this college? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCollegeId && deleteMutation.mutate(deleteCollegeId)} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ExpandedCollegeEdit({ college, onUpdate, isPending, onDelete, onUploadImage }: {
  college: College;
  onUpdate: (data: Partial<College>) => void;
  isPending: boolean;
  onDelete: () => void;
  onUploadImage: () => void;
}) {
  const [localCollege, setLocalCollege] = useState(college);
  const years = ["2024", "2025", "2026", "2027", "2028"];

  const handleYearDataUpdate = (field: keyof College, year: string, value: string) => {
    const currentData = (localCollege[field] as Record<string, any>) || {};
    const updatedData = { ...currentData, [year]: value };
    setLocalCollege({ ...localCollege, [field]: updatedData });
  };

  const handleSave = () => {
    onUpdate(localCollege);
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
          <label className="text-sm font-medium">College Name</label>
          <Input
            value={localCollege.name}
            onChange={(e) => setLocalCollege({ ...localCollege, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Logo Path</label>
          <Input
            value={localCollege.logoPath || ""}
            onChange={(e) => setLocalCollege({ ...localCollege, logoPath: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        {years.map((year) => (
          <Card key={year}>
            <CardHeader>
              <CardTitle className="text-lg">Class of {year}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Commitments</label>
                <Textarea
                  placeholder="List of player commitments..."
                  value={(localCollege.commitments as Record<string, string>)?.[year] || ""}
                  onChange={(e) => handleYearDataUpdate('commitments', year, e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Recruits</label>
                <Textarea
                  placeholder="List of active recruits..."
                  value={(localCollege.recruits as Record<string, string>)?.[year] || ""}
                  onChange={(e) => handleYearDataUpdate('recruits', year, e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CollegeForm({ defaultValues, onSubmit, isPending }: {
  defaultValues?: Partial<College>;
  onSubmit: (data: typeof insertCollegeSchema._type) => void;
  isPending: boolean;
}) {
  const form = useForm({
    resolver: zodResolver(insertCollegeSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      logoPath: defaultValues?.logoPath || "",
      commitments: defaultValues?.commitments || {},
      recruits: defaultValues?.recruits || {},
      sourceUrls: defaultValues?.sourceUrls || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College Name*</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-college-name" />
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
                <Input {...field} value={field.value ?? ""} data-testid="input-college-logo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isPending} data-testid="button-submit-college">
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
