import { DrizzleQueryError, eq, count } from 'drizzle-orm';
import db from '../configs/db.config';
import { Request, Response } from 'express';
import { problemsTable } from '../db/schema';
import LFURedisCache from '../redis';

const redis = new LFURedisCache();

export async function getProblems(req: Request, res: Response) {
  try {
    let queryParams = req.query;
    let page = 1,
      limit = 2,
      totalProblems = 0,
      totalPages = 0;

    if (
      queryParams['page'] !== undefined &&
      queryParams['limit'] !== undefined
    ) {
      page = parseInt(queryParams['page'] as string);
      limit = parseInt(queryParams['limit'] as string);
    }

    let totalResults = await redis.client.get('total_problems');

    if (totalResults == null) {
      let totalProblemsResult = await db
        .select({ count: count() })
        .from(problemsTable);

      if (totalProblemsResult.length > 0) {
        totalProblems = totalProblemsResult[0].count;
        totalPages = Math.ceil(totalProblems / limit);
        await redis.client.set('total_problems', totalProblems, 'EX', 300);
      }
    } else {
      totalProblems = parseInt(totalResults);
      totalPages = Math.ceil(totalProblems / limit);
    }

    let data = await db
      .select()
      .from(problemsTable)
      .offset((page - 1) * limit)
      .limit(limit);

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
    let data = await redis.get(problemId);
    if (data == null) {
      data = await db
        .select()
        .from(problemsTable)
        .where(eq(problemsTable.problemId, problemId));
      await redis.push(problemId, data);
    }
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
