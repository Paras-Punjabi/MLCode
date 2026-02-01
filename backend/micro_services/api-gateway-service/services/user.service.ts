import db from '../../database/connector';
import { usersTable as users } from '../../database/schema';
import { eq, sql } from 'drizzle-orm';
import clerkClient from '../../configs/clerk.config';

export type InsertedUserType = typeof users.$inferInsert;
export type SelectedUserType = typeof users.$inferSelect;
export type RoleType = NonNullable<InsertedUserType['userRoles']>[number];

class UserService {
  constructor(private database = db) {}

  /**
   * Find all users in database
   *
   * @returns Users
   */
  async findAll() {
    return await this.database.select().from(users);
  }

  /**
   * Find user by userId
   *
   * @param userId - User ID provided from IdP
   * @returns User or null if user not signed up
   */
  async findById(userId: string) {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    return user as typeof user | null;
  }

  /**
   * Insert or update user if exists
   *
   * @param user
   * @returns Inserted/updated user
   */
  async upsert(user: InsertedUserType) {
    const [result] = await this.database
      .insert(users)
      .values(user)
      .onConflictDoUpdate({ target: users.userId, set: user })
      .returning();
    return result;
  }

  /**
   * Delete a user given its userId
   *
   * @param userId
   * @returns user deleted or null if not deleted
   */
  async delete(userId: string) {
    const result = await this.database
      .delete(users)
      .where(eq(users.userId, userId));

    return result.rowCount ? result.rows[0] : null;
  }

  /**
   * Assign a role to a user with userId
   *
   * @param userId
   * @returns Updated user
   */
  async assignRole(userId: string, role: RoleType) {
    const [udpatedUser] = await this.database
      .update(users)
      .set({
        userRoles: sql`array_append(${users.userRoles}, '${role}')`,
      })
      .where(eq(users.userId, userId))
      .returning();

    return udpatedUser;
  }

  /**
   * Revoke a role from a user with userId
   *
   * @param userId
   * @returns Updated user
   */
  async revokeRole(userId: string, role: RoleType) {
    const [updatedUser] = await this.database
      .update(users)
      .set({
        userRoles: sql`array_remove(${users.userRoles}, '${role}')`,
      })
      .where(eq(users.userId, userId))
      .returning();

    return updatedUser;
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
    };
  }
}

export default UserService;
