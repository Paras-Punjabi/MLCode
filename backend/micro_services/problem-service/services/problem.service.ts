import { LFURedisCache, RedisCache } from '../services/redis.service';
import { eq, count } from 'drizzle-orm';
import db from '../../database/connector';
import { problemLevelEnum, problemsTable } from '../../database/schema';

type InsertedProblemType = typeof problemsTable.$inferSelect;
type ProblemLevelType = NonNullable<InsertedProblemType['problemLevel']>;

export default class ProblemService {
  private lfuRedis: LFURedisCache;
  private redisCache: RedisCache;

  constructor() {
    this.lfuRedis = new LFURedisCache();
    this.redisCache = new RedisCache();
  }

  async getProblemsCountByLevel(): Promise<
    { count: number; problemLevel: string }[]
  > {
    let totalProblemsCache = await this.redisCache.get(
      'total_problems_by_level'
    );
    if (totalProblemsCache) {
      let data: { count: number; problemLevel: string }[] = [];
      totalProblemsCache.split(';').forEach((item) => {
        let [level, count] = item.split('=');
        data.push({ count: parseInt(count), problemLevel: level });
      });
      return data;
    }
    const data = await db
      .select({ count: count(), problemLevel: problemsTable.problemLevel })
      .from(problemsTable)
      .groupBy(problemsTable.problemLevel);

    let cacheData = '';

    data.forEach((item) => {
      cacheData += `${item.problemLevel}=${item.count};`;
    });
    cacheData = cacheData.slice(0, -1);

    await this.redisCache.set('total_problems_by_level', 300, cacheData);

    return data;
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
      .limit(limit)
      .orderBy(problemsTable.problemNumber);

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

  async insertProblem(
    problemSlug: string,
    problemName: string,
    problemDesc: string,
    problemTags: string,
    problemLevel: ProblemLevelType
  ) {
    const data = await db
      .insert(problemsTable)
      .values({
        problemSlug,
        problemDesc,
        problemLevel,
        problemName,
        problemTags,
      })
      .returning();
    await this.redisCache.remove('total_problems_by_level');
    await this.redisCache.remove('total_problems');
    return data;
  }

  async updateProblem(
    problemSlug: string,
    problemName: string,
    problemDesc: string,
    problemTags: string,
    problemLevel: ProblemLevelType
  ) {
    const data = await db
      .update(problemsTable)
      .set({
        problemSlug,
        problemDesc,
        problemLevel,
        problemName,
        problemTags,
      })
      .returning();
    return data;
  }
}
