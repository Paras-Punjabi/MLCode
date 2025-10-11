import { LFURedisCache, RedisCache } from '@/services/redis.service';
import { eq, count } from 'drizzle-orm';
import db from '@/configs/db.config';
import { problemsTable } from '@/db/schema';

export default class ProblemService {
  private lfuRedis: LFURedisCache;
  private redisCache: RedisCache;

  constructor() {
    this.lfuRedis = new LFURedisCache();
    this.redisCache = new RedisCache();
    console.log('Redis Connected');
  }

  async getProblems(page: number, limit: number) {
    let totalProblemsCache = await this.redisCache.get('total_problems');
    let totalPages = 0,
      totalProblems;

    if (totalProblemsCache == null) {
      let totalProblemsResult = await db
        .select({ count: count() })
        .from(problemsTable);

      if (totalProblemsResult.length > 0) {
        totalProblems = totalProblemsResult[0].count;
        totalPages = Math.ceil(totalProblems / limit);

        await this.redisCache.set(
          'total_problems',
          300,
          totalProblems.toString()
        );
      }
    } else {
      totalProblems = parseInt(totalProblemsCache);
      totalPages = Math.ceil(totalProblems / limit);
    }

    let data = await db
      .select()
      .from(problemsTable)
      .offset((page - 1) * limit)
      .limit(limit);

    return { data, totalProblems, totalPages };
  }

  async getProblemById(problemId: string) {
    let data = await this.lfuRedis.get(problemId);
    if (data == null) {
      data = await db
        .select()
        .from(problemsTable)
        .where(eq(problemsTable.problemId, problemId));
      await this.lfuRedis.push(problemId, data);
    }
    return data;
  }
}
