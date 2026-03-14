import { useState } from "react";
import { Submission } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Clock, Cpu } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<
  string,
  {
    label: string;
    badgeStyle: React.CSSProperties;
    verdictStyle: React.CSSProperties;
    icon: React.ReactNode;
  }
> = {
  ACCEPTED: {
    label: "Accepted",
    badgeStyle: {
      backgroundColor: "hsl(142 72% 29% / 0.12)",
      color: "hsl(142 72% 50%)",
      borderColor: "hsl(142 72% 29% / 0.3)",
    },
    verdictStyle: {
      backgroundColor: "hsl(142 72% 29% / 0.12)",
      border: "1px solid hsl(142 72% 29% / 0.3)",
      color: "hsl(142 72% 50%)",
    },
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  ATTEMPTED: {
    label: "Attempted",
    badgeStyle: {
      backgroundColor: "hsl(38 92% 50% / 0.12)",
      color: "hsl(38 92% 60%)",
      borderColor: "hsl(38 92% 50% / 0.3)",
    },
    verdictStyle: {
      backgroundColor: "hsl(38 92% 50% / 0.12)",
      border: "1px solid hsl(38 92% 50% / 0.3)",
      color: "hsl(38 92% 60%)",
    },
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  PENDING: {
    label: "Pending",
    badgeStyle: {
      backgroundColor: "hsl(192 91% 36% / 0.12)",
      color: "hsl(192 91% 56%)",
      borderColor: "hsl(192 91% 36% / 0.3)",
    },
    verdictStyle: {
      backgroundColor: "hsl(192 91% 36% / 0.12)",
      border: "1px solid hsl(192 91% 36% / 0.3)",
      color: "hsl(192 91% 56%)",
    },
    icon: <Cpu className="w-3.5 h-3.5" />,
  },
  FAILED: {
    label: "Failed",
    badgeStyle: {
      backgroundColor: "hsl(0 74% 42% / 0.12)",
      color: "hsl(0 74% 65%)",
      borderColor: "hsl(0 74% 42% / 0.3)",
    },
    verdictStyle: {
      backgroundColor: "hsl(0 74% 42% / 0.12)",
      border: "1px solid hsl(0 74% 42% / 0.3)",
      color: "hsl(0 74% 65%)",
    },
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CodeBlock({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="space-y-1.5">
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-palette-secondary-dark)" }}
      >
        {label}
      </p>
      <pre
        className="rounded-lg px-4 py-3 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed"
        style={{
          backgroundColor: "var(--color-palette-background-dark)",
          border: "1px solid var(--color-palette-border-dark)",
          color: "var(--color-palette-foreground-dark)",
        }}
      >
        {JSON.stringify(JSON.parse(value), null, 2)}
      </pre>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

const SubmissionDetails = ({ submissions }: { submissions: Submission[] }) => {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  return (
    <div className="w-[95%] mx-auto">
      {/* ── table ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: "1px solid var(--color-palette-border-dark)",
          backgroundColor: "var(--color-palette-surface-dark)",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow
              className="hover:bg-transparent"
              style={{ borderColor: "var(--color-palette-border-dark)" }}
            >
              <TableHead
                className="font-semibold text-xs uppercase tracking-wider w-[30%] px-6 py-3"
                style={{ color: "var(--color-palette-secondary-dark)" }}
              >
                Submitted
              </TableHead>
              <TableHead
                className="font-semibold text-xs uppercase tracking-wider w-[30%] px-6 py-3"
                style={{ color: "var(--color-palette-secondary-dark)" }}
              >
                Status
              </TableHead>
              <TableHead
                className="font-semibold text-xs uppercase tracking-wider w-[40%] px-6 py-3"
                style={{ color: "var(--color-palette-secondary-dark)" }}
              >
                Verdict
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow
                style={{ borderColor: "var(--color-palette-border-dark)" }}
              >
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-sm px-6"
                  style={{ color: "var(--color-palette-secondary-dark)" }}
                >
                  No submissions yet
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => {
                const cfg = statusConfig[sub.status];
                return (
                  <TableRow
                    key={sub.submissionId}
                    className="cursor-pointer transition-colors group"
                    style={{ borderColor: "var(--color-palette-border-dark)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "hsl(174 69% 51% / 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                    }}
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    {/* date */}
                    <TableCell
                      className="text-sm tabular-nums px-6 py-4 w-[30%]"
                      style={{ color: "var(--color-palette-secondary-dark)" }}
                    >
                      {formatDate(sub.createdAt)}
                    </TableCell>

                    {/* status badge */}
                    <TableCell className="px-6 py-4 w-[30%]">
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1.5 text-xs font-medium"
                        style={cfg.badgeStyle}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </Badge>
                    </TableCell>

                    {/* verdict */}
                    <TableCell
                      className="text-sm max-w-75 truncate px-6 py-4 w-[40%]"
                      style={{ color: "var(--color-palette-foreground-dark)" }}
                    >
                      {sub.verdict}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── dialog ── */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={() => setSelectedSubmission(null)}
      >
        <DialogContent
          className="max-w-2xl p-0 gap-0"
          style={{
            backgroundColor: "var(--color-palette-surface-dark)",
            border: "1px solid var(--color-palette-border-dark)",
            color: "var(--color-palette-foreground-dark)",
          }}
        >
          {selectedSubmission && (
            <>
              {/* header */}
              <DialogHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center">
                  <DialogTitle
                    className="text-base font-semibold"
                    style={{ color: "var(--color-palette-foreground-dark)" }}
                  >
                    Submission Details
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className="flex items-center mx-2 text-xs font-medium"
                    style={statusConfig[selectedSubmission.status].badgeStyle}
                  >
                    {statusConfig[selectedSubmission.status].icon}
                    {statusConfig[selectedSubmission.status].label}
                  </Badge>
                </div>

                {/* meta row */}
                <div
                  className="flex flex-wrap gap-x-5 text-xs"
                  style={{ color: "var(--color-palette-secondary-dark)" }}
                >
                  <span>
                    <span
                      style={{
                        color: "var(--color-palette-secondary-dark)",
                        opacity: 0.6,
                      }}
                    >
                      Submitted{" "}
                    </span>
                    {formatDate(selectedSubmission.createdAt)}
                  </span>
                </div>
              </DialogHeader>

              <Separator
                style={{ backgroundColor: "var(--color-palette-border-dark)" }}
              />

              <ScrollArea className="max-h-[60vh]">
                <div className="px-6 py-5 space-y-5">
                  {/* verdict banner */}
                  {selectedSubmission.verdict && (
                    <div
                      className="rounded-lg px-4 py-3 text-sm flex items-center gap-3"
                      style={
                        statusConfig[selectedSubmission.status].verdictStyle
                      }
                    >
                      {statusConfig[selectedSubmission.status].icon}
                      <span>{selectedSubmission.verdict}</span>
                    </div>
                  )}

                  {/* failed test-case details */}
                  {selectedSubmission.status === "ATTEMPTED" && (
                    <div className="grid gap-3">
                      <CodeBlock
                        label="Input"
                        value={selectedSubmission.input}
                      />
                      <CodeBlock
                        label="Your Output"
                        value={selectedSubmission.output}
                      />
                      <CodeBlock
                        label="Expected Output"
                        value={selectedSubmission.expected}
                      />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionDetails;
