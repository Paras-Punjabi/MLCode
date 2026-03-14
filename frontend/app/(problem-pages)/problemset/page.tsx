"use client";
import useAxios from "@/hooks/useAxios";
import Link from "next/link";
import { type Problem } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Loader from "@/components/Loader";

const getDifficultyColor = (problemLevel: string) => {
  switch (problemLevel) {
    case "EASY":
      return "text-emerald-500";
    case "MEDIUM":
      return "text-amber-500";
    case "HARD":
      return "text-rose-500";
    default:
      return "text-gray-400";
  }
};

const ProblemLink = ({ problem, idx }: { problem: Problem; idx: number }) => {
  return (
    <Link
      href={`/problems/${problem.problemSlug}?tab=question`}
      key={idx}
      className={`flex items-center ${idx % 2 == 0 && "bg-gray-800/50"}  px-4 my-2 py-4 rounded-xl cursor-pointer`}
    >
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-white font-medium whitespace-nowrap">
          {problem.problemNumber}.
        </span>
        <span className="text-white truncate">{problem.problemName}</span>
      </div>

      <div className="flex items-center justify-between gap-6">
        <div>
          {problem.problemTags.split(",").map((item, i) => {
            return (
              <span
                className="mx-1 text-sm bg-gray-700 py-1 px-2 uppercase rounded-md"
                key={i}
              >
                {item}
              </span>
            );
          })}
        </div>
        <span
          className={`w-20 font-medium ${getDifficultyColor(problem.problemLevel)}`}
        >
          {problem.problemLevel}
        </span>
      </div>
    </Link>
  );
};

export default function ProblemSet() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let totalPages: number;
  const page = parseInt(searchParams.get("page") as string) || 1;
  const [{ data, loading }] = useAxios(
    {
      url: "/services/problems",
      params: { page },
    },
    { useCache: true },
  );

  if (loading) {
    return <Loader />;
  } else {
    totalPages = data.pagination.total_pages;
  }

  if (data && data.data.length == 0 && page !== 1) {
    return router.push("/problemset");
  }

  return (
    <>
      <div className="p-4">
        <div className="mx-auto w-full text-white text-lg">
          {data &&
            data.data.map((problem: Problem, idx: number) => {
              return <ProblemLink problem={problem} key={idx} idx={idx} />;
            })}
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination className="font-extrabold fixed bottom-0 left-0 w-full p-4">
          <PaginationContent>
            {page != 1 && (
              <PaginationItem className="cursor-pointer">
                <PaginationLink
                  onClick={() => router.push(`problemset?page=${page - 1}`)}
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem className="cursor-pointer text-black">
              <PaginationLink href={`problemset?page=${page}`} isActive={true}>
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
    </>
  );
}
