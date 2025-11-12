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
import { insertHighSchoolSchema, type HighSchool } from "@shared/schema";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function AdminHighSchools() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editSchool, setEditSchool] = useState<HighSchool | null>(null);
  const [deleteSchoolId, setDeleteSchoolId] = useState<number | null>(null);
  const { toast } = useToast();

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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredSchools && filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <TableRow key={school.id} data-testid={`row-highschool-${school.id}`}>
                  <TableCell className="font-medium">{school.school}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditSchool(school)} data-testid={`button-edit-highschool-${school.id}`}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteSchoolId(school.id)} data-testid={`button-delete-highschool-${school.id}`}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No high schools found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
