import { DrizzleQueryError, eq, count } from 'drizzle-orm';
import { Request, Response } from 'express';
import ProblemService from '@/services/problem.service';

const problemService = new ProblemService();

export async function getProblems(req: Request, res: Response) {
  try {
    let queryParams = req.query;
    let page = 1,
      limit = 2;

    if (
      queryParams['page'] !== undefined &&
      queryParams['limit'] !== undefined
    ) {
      page = parseInt(queryParams['page'] as string);
      limit = parseInt(queryParams['limit'] as string);
    }

    let { data, totalProblems, totalPages } = await problemService.getProblems(
      page,
      limit
    );

    res.status(200).json({
      success: true,
      data,
      message: 'All Problems Data',
      pagination: {
        total_items: totalProblems,
        current_page: page,
        items_per_page: limit,
        total_pages: totalPages,
        next_page_link:
          page + 1 <= totalPages
            ? req.baseUrl + `?page=${page + 1}&limit=${limit}`
            : null,
        prev_page_link:
          page - 1 > 0
            ? req.baseUrl + `?page=${page - 1}&limit=${limit}`
            : null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
}

export async function getProblemById(req: Request, res: Response) {
  try {
    let problemId: string = req.params.problem_id;
    let data = await problemService.getProblemById(problemId);
    res.status(200).json({
      success: true,
      data,
      message: `Problem Data with problem_id ${problemId}`,
    });
  } catch (err) {
    if (err instanceof DrizzleQueryError) {
      res
        .status(400)
        .json({ success: false, message: `Invalid UUID provided` });
    } else {
      res.status(500).json({ success: false, message: err });
    }
  }
}
