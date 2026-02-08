import db from '../../database/connector';
import { usersTable } from '../../database/schema';
import { eq, count } from 'drizzle-orm';
import clerkClient from '../../configs/clerk.config';
import { RedisCache } from '../../problem-service/services/redis.service';

export type InsertedUserType = typeof usersTable.$inferInsert;
export type SelectedUserType = typeof usersTable.$inferSelect;

class UserService {
  private redisCache: RedisCache;

  constructor() {
    this.redisCache = new RedisCache();
  }
  async findAll() {
    return await db.select().from(usersTable);
  }

  async getUsersById(userIds: string[]) {
    const data = await clerkClient.users.getUserList({
      userId: userIds,
    });
    let usersDetails: {
      [key: string]: {
        username: string | null;
        email: string | undefined;
        name: string | null;
      };
    } = {};

    data.data.forEach((item) => {
      usersDetails[item.id] = {
        username: item.username,
        email: item.primaryEmailAddress?.emailAddress,
        name: item.firstName + ' ' + item.lastName,
      };
    });
    return usersDetails;
  }

  async upsert(user: InsertedUserType) {
    const [result] = await db
      .insert(usersTable)
      .values(user)
      .onConflictDoUpdate({ target: usersTable.userId, set: user })
      .returning();
    return result;
  }

  async delete(userId: string) {
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.userId, userId));

    return result.rowCount ? result.rows[0] : null;
  }

  async getUserDetailsFromClerk(username: string) {
    let data = await clerkClient.users.getUserList({
      username: [username],
    });
    if (!data.totalCount) return null;
    const userDetails = data['data'][0];
    return {
      imageUrl: userDetails.imageUrl,
      hasImage: userDetails.hasImage,
      username: userDetails.username,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      createdAt: userDetails.createdAt,
    };
  }

  async getTotalUsers() {
    const cacheData = await this.redisCache.get('total_users');
    if (cacheData) return parseInt(cacheData);
    let data = await db.select({ count: count() }).from(usersTable);
    if (data.length > 0) {
      this.redisCache.set('total_users', 300, data[0].count.toString());
      return data[0].count;
    }
    return 0;
  }
}

export default UserService;
