import db from '../../database/connector';
import { submissionsTable } from '../../database/schema';
import { and, desc, eq } from 'drizzle-orm';
import { KafkaProducer, MessageType } from './kafka.service';
import config from '../../configs/dotenv.config';

type InsertedSubmissionType = typeof submissionsTable.$inferInsert;

const producer = new KafkaProducer(
  {
    allowAutoTopicCreation: true,
  },
  config.KAFKA_TOPIC
);

producer.connect();

class SubmissionService {
  async addPendingSubmission(userId: string, problemSlug: string) {
    let [data] = await db
      .insert(submissionsTable)
      .values({
        userId,
        problemSlug,
        status: 'PENDING',
        verdict: 'Submission Queued',
      })
      .returning();
    return data;
  }

  async updateSubmission(
    data: Omit<InsertedSubmissionType, 'userId' | 'problemSlug'>
  ) {
    await db
      .update(submissionsTable)
      .set(data)
      .where(eq(submissionsTable.submissionId, data.submissionId!));
  }

  async getSubmissions(userId: string, problemSlug: string | undefined) {
    let data = null;
    if (problemSlug) {
      data = await db
        .select()
        .from(submissionsTable)
        .where(
          and(
            eq(submissionsTable.userId, userId),
            eq(submissionsTable.problemSlug, problemSlug)
          )
        )
        .orderBy(desc(submissionsTable.createdAt));
    } else {
      data = await db
        .select()
        .from(submissionsTable)
        .where(eq(submissionsTable.userId, userId))
        .orderBy(desc(submissionsTable.createdAt));
    }
    return data;
  }

  async pushSubmissionToKafka(userId: string, problemSlug: string) {
    let message = { userId, problemSlug } as MessageType;
    producer.push(message);
  }
}

export default SubmissionService;
