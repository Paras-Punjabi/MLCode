import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Button } from "./ui/button";
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "./ui/field";
import { Input } from "./ui/input";
import { Kbd } from "./ui/kbd";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

type CreateProblemFormData = {
  problemSlug: string;
  problemName: string;
  problemDesc: string;
  problemTags: string;
  problemLevel: string;
  files: FileList | null;
};

type CreateProblemFormFiles = {
  datasets: File[];
  answers: File[];
};

type CreateProblemProps = {
  onSubmit: (props: {
    form: Omit<CreateProblemFormData, "files">;
    files: CreateProblemFormFiles;
  }) => void;
  initialFormState?: Omit<CreateProblemFormData, "files">;
};

const REQ_FILES = ["train.csv", "test.csv", "variables.json", "schema.json", "answer.csv"] as const;

const FILE_CATEGORY_MAP: Record<string, keyof CreateProblemFormFiles> = {
  "train.csv": "datasets",
  "test.csv": "datasets",
  "variables.json": "answers",
  "schema.json": "answers",
  "answer.csv": "answers",
};

const difficultyOpts = [
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
];

export default function CreateProblem({
  onSubmit,
  initialFormState = {
    problemSlug: "",
    problemName: "",
    problemDesc: "",
    problemTags: "",
    problemLevel: "",
  },
}: CreateProblemProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProblemFormData>({
    defaultValues: { ...initialFormState, files: null },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const problemName = watch("problemName");
  const problemSlug = watch("problemSlug");
  const problemDesc = watch("problemDesc");
  const problemTags = watch("problemTags");
  const problemLevel = watch("problemLevel");

  const onValidSubmit = (data: CreateProblemFormData) => {
    const formFiles = selectedFiles.reduce(
      (filesMap, file) => {
        filesMap[FILE_CATEGORY_MAP[file.name]].push(file);
        return filesMap;
      },
      { answers: [], datasets: [] } as CreateProblemFormFiles
    );
    const { files: _, ...rest } = data;
    onSubmit({ form: rest, files: formFiles });
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <form onSubmit={handleSubmit(onValidSubmit)}>
        <FieldGroup>

          <Field>
            <FieldLabel htmlFor="problemName">Problem Name</FieldLabel>
            <Input
              id="problemName"
              placeholder="Enter problem name"
              aria-invalid={!!errors.problemName}
              {...register("problemName", {
                required: "Problem name is required",
                minLength: { value: 3, message: "Must be at least 3 characters" },
              })}
            />
            {errors.problemName && <FieldError>{errors.problemName.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="problemSlug">Problem Slug</FieldLabel>
            <Input
              id="problemSlug"
              placeholder="my-problem-slug"
              aria-invalid={!!errors.problemSlug}
              {...register("problemSlug", {
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                  message: "Slug must be lowercase kebab-case (e.g. my-problem)",
                },
              })}
            />
            {errors.problemSlug && <FieldError>{errors.problemSlug.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="problemDesc">Problem Description</FieldLabel>
            <Textarea
              id="problemDesc"
              placeholder="Enter description in markdown"
              className="h-60 resize-none"
              aria-invalid={!!errors.problemDesc}
              {...register("problemDesc", {
                required: "Description is required",
                minLength: { value: 20, message: "Description must be at least 20 characters" },
              })}
            />
            {errors.problemDesc && <FieldError>{errors.problemDesc.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="problemLevel">Difficulty</FieldLabel>
            <Select
              value={problemLevel}
              onValueChange={(v) => setValue("problemLevel", v, { shouldValidate: true })}
            >
              <SelectTrigger aria-invalid={!!errors.problemLevel}>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOpts.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("problemLevel", { required: "Please select a difficulty" })}
            />
            {errors.problemLevel && <FieldError>{errors.problemLevel.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="problemTags">Problem Tags</FieldLabel>
            <Input
              id="problemTags"
              placeholder="regression, classification, ..."
              aria-invalid={!!errors.problemTags}
              {...register("problemTags", {
                required: "At least one tag is required",
                validate: (v) =>
                  v.split(",").filter((t) => t.trim().length > 0).length >= 1 ||
                  "Enter at least one valid tag",
              })}
            />
            <FieldDescription>Enter comma separated problem tags</FieldDescription>
            {errors.problemTags && <FieldError>{errors.problemTags.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="files">Dataset and Answer Files</FieldLabel>
            <Input
              id="files"
              type="file"
              multiple
              accept=".csv,.json"
              aria-invalid={!!errors.files}
              {...register("files", {
                validate: () => {
                  const fileNames = selectedFiles.map((f) => f.name);
                  const missing = REQ_FILES.filter((r) => !fileNames.includes(r));
                  return missing.length === 0 || `Missing: ${missing.join(", ")}`;
                },
              })}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const uploaded = e.target.files;
                if (!uploaded) return;
                const valid: File[] = [];
                for (const file of uploaded) {
                  if (REQ_FILES.includes(file.name as typeof REQ_FILES[number])) {
                    valid.push(file);
                  }
                }
                setSelectedFiles(valid);
              }}
            />
            <FieldDescription>
              Upload files:
              {REQ_FILES.map((f) => <Kbd className="ml-1" key={f}>{f}</Kbd>)}
            </FieldDescription>
            {errors.files && <FieldError>{errors.files.message}</FieldError>}
            {selectedFiles.length > 0 && (
              <ul className="space-y-2 mt-2">
                {selectedFiles.map(({ name, size }) => (
                  <li
                    key={name}
                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="font-mono truncate text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      ({(size / 1024).toFixed(1)} KB)
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <Button type="submit" variant="default" className="w-full">Submit</Button>
        </FieldGroup>
      </form>

      <div>
        {problemSlug && (
          <div className="bg-transparent border border-input px-3 py-2 flex items-center font-mono text-sm rounded-md">
            <span>{`/problemset/${problemSlug}`}</span>
          </div>
        )}
        <div className="problem-preview">
          {problemName && <h1>{problemName}</h1>}
          <div className="flex flex-row items-start justify-between my-4">
            <div className="flex flex-row gap-2">
              {problemTags &&
                problemTags
                  .split(",")
                  .filter((t) => t.trim().length)
                  .map((tag, i) => <Badge key={i}>{tag.trim()}</Badge>)}
            </div>
            {problemLevel && (
              <Badge className={cn({
                "bg-success": problemLevel === "EASY",
                "bg-warning": problemLevel === "MEDIUM",
                "bg-error": problemLevel === "HARD",
              })}>
                {problemLevel}
              </Badge>
            )}
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{problemDesc}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
