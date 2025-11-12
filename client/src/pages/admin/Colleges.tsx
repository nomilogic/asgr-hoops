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
import { insertCollegeSchema, type College } from "@shared/schema";
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminColleges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCollege, setEditCollege] = useState<College | null>(null);
  const [deleteCollegeId, setDeleteCollegeId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
          <p className="text-muted-foreground">Manage colleges and commitments</p>
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>College Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredColleges && filteredColleges.length > 0 ? (
              filteredColleges.map((college) => (
                <TableRow key={college.id} data-testid={`row-college-${college.id}`}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={college.logoPath || college.logoUrl || undefined} />
                      <AvatarFallback>
                        <ImageIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{college.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={uploadingImage === college.id} onOpenChange={(open) => !open && setUploadingImage(null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setUploadingImage(college.id)}
                            title="Upload Logo"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
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
                              onClick={() => handleImageUpload(college.id)}
                              disabled={!imageFile || uploadImageMutation.isPending}
                            >
                              {uploadImageMutation.isPending ? "Uploading..." : "Upload"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => setEditCollege(college)} data-testid={`button-edit-college-${college.id}`}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteCollegeId(college.id)} data-testid={`button-delete-college-${college.id}`}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No colleges found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
      logoUrl: defaultValues?.logoUrl || "",
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
