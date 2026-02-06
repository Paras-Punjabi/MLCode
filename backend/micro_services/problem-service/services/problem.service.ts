import { LFURedisCache, RedisCache } from '../services/redis.service';
import { eq, count } from 'drizzle-orm';
import db from '../../database/connector';
import { problemsTable } from '../../database/schema';

export default class ProblemService {
  private lfuRedis: LFURedisCache;
  private redisCache: RedisCache;

  constructor() {
    this.lfuRedis = new LFURedisCache();
    this.redisCache = new RedisCache();
    console.log('Redis Connected');
  }

  async getProblemsCount() {
    let totalProblemsCache = await this.redisCache.get('total_problems');
    if (totalProblemsCache) return parseInt(totalProblemsCache);
    let totalProblems;
    let totalProblemsResult = await db
      .select({ count: count() })
      .from(problemsTable);

    if (totalProblemsResult.length > 0) {
      totalProblems = totalProblemsResult[0].count;

      await this.redisCache.set(
        'total_problems',
        300,
        totalProblems.toString()
      );
    } else totalProblems = 0;
    return totalProblems;
  }

  async getProblems(page: number, limit: number) {
    let totalProblems = await this.getProblemsCount();
    let totalPages = Math.ceil(totalProblems / limit);

    let data = await db
      .select()
      .from(problemsTable)
      .offset((page - 1) * limit)
      .limit(limit);

    return { data, totalProblems, totalPages };
  }

  async getProblemBySlug(problemSlug: string) {
    let data = await this.lfuRedis.get(problemSlug);
    if (data == null) {
      data = await db
        .select()
        .from(problemsTable)
        .where(eq(problemsTable.problemSlug, problemSlug));
      await this.lfuRedis.push(problemSlug, data);
    }
    return data;
  }
}
