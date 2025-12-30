import { eq } from 'drizzle-orm';
import db from '../../database/connector';
import { problemSessionsTable } from '../../database/schema';

export default class SessionService {
  async getCurrentSession(userId: string) {
    let data = await db
      .select()
      .from(problemSessionsTable)
      .where(eq(problemSessionsTable.userId, userId));
    return data;
  }

  async insertSession(userId: string, problemId: string) {
    let data = await db
      .insert(problemSessionsTable)
      .values({
        problemId: problemId,
        userId: userId,
      })
      .returning();
    return data;
  }

  async deleteSession(userId: string) {
    let data = await db
      .delete(problemSessionsTable)
      .where(eq(problemSessionsTable.userId, userId))
      .returning();
    return data;
  }
}
