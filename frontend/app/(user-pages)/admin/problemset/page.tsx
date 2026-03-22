"use client";

import { useState } from "react";
import useAxios from "@/hooks/useAxios";
import { type Problem } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import CreateProblem from "@/components/CreateProblemForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Edit2, Plus } from "lucide-react";
import axiosInstance from "@/configs/axios.config";
import { toast } from "sonner";

const getDifficultyColor = (problemLevel: string) => {
  switch (problemLevel) {
    case "EASY":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "MEDIUM":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "HARD":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }
};

export default function AdminProblemSet() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") as string) || 1;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);

  const [{ data, loading }, refetch] = useAxios(
    {
      url: "/services/problems",
      params: { page },
    },
    { useCache: false }
  );

  if (loading && !data) {
    return <Loader />;
  }

  const totalPages = data?.pagination?.total_pages || 1;

  const handleCreate = () => {
    setEditingProblem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem);
    setIsDialogOpen(true);
  };

  const onSubmitForm = async ({
    form,
    files,
  }: {
    form: any;
    files: { datasets: File[]; answers: File[] };
  }) => {
    const formData = new FormData();

    // Add form fields
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    // Add files
    files.datasets.forEach((file) => {
      formData.append("datasets", file);
    });
    files.answers.forEach((file) => {
      formData.append("answers", file);
    });

    try {
      if (editingProblem) {
        // Update
        const response = await axiosInstance.put(
          `/services/problems/${editingProblem.problemSlug}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200 || response.status === 204) {
          toast.success("Problem updated successfully");
        } else {
          toast.error("Failed to update problem");
        }
      } else {
        // Create
        const response = await axiosInstance.post("/admin/problem/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201 || response.status === 200) {
          toast.success("Problem created successfully");
        } else {
          toast.error("Failed to create problem");
        }
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error submitting problem:", error);
      toast.error("An error occurred while saving the problem");
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Problems</h1>
          <p className="text-muted-foreground">
            Manage the problem set for the platform.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Problem
        </Button>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">#</TableHead>
              <TableHead>Problem Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((problem: Problem) => (
              <TableRow key={problem.problemSlug}>
                <TableCell className="font-medium">
                  {problem.problemNumber}
                </TableCell>
                <TableCell>{problem.problemName}</TableCell>
                <TableCell className="font-mono text-xs">
                  {problem.problemSlug}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(problem.problemLevel)}
                  >
                    {problem.problemLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {problem.problemTags.split(",").map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] uppercase">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(problem)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem className="cursor-pointer">
                <PaginationLink
                  onClick={() => router.push(`problemset?page=${page - 1}`)}
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem className="cursor-pointer">
              <PaginationLink
                isActive
                onClick={() => router.push(`problemset?page=${page}`)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
            {page < totalPages && (
              <PaginationItem className="cursor-pointer">
                <PaginationLink
                  onClick={() => router.push(`problemset?page=${page + 1}`)}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProblem ? "Edit Problem" : "Create New Problem"}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-4">
              <CreateProblem
                onSubmit={onSubmitForm}
                initialFormState={
                  editingProblem
                    ? {
                      problemSlug: editingProblem.problemSlug,
                      problemName: editingProblem.problemName,
                      problemDesc: editingProblem.problemDesc,
                      problemTags: editingProblem.problemTags,
                      problemLevel: editingProblem.problemLevel,
                    }
                    : undefined
                }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
