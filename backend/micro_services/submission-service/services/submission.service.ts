import db from '../../database/connector';
import { submissionsTable } from '../../database/schema';
import { and, eq } from 'drizzle-orm';
import { KafkaProducer, MessageType } from './kafka.service';
import config from '../../configs/dotenv.config';

type InsertedSubmissionType = typeof submissionsTable.$inferSelect;
type StatusType = NonNullable<InsertedSubmissionType['status']> | undefined;

const producer = new KafkaProducer(
  {
    allowAutoTopicCreation: true,
  },
  config.KAFKA_TOPIC
);

producer.connect();

class SubmissionService {
  async addPendingSubmission(userId: string, problemId: string) {
    let [data] = await db
      .insert(submissionsTable)
      .values({ userId, problemId, status: 'PENDING' })
      .returning();
    return data;
  }

  async updateSubmission({
    submissionId,
    status = undefined,
    input = undefined,
    output = undefined,
    expected = undefined,
  }: {
    submissionId: string;
    status: StatusType;
    input: string | undefined;
    output: string | undefined;
    expected: string | undefined;
  }) {
    let updateObj: { [key: string]: string } = {};
    if (status) updateObj['status'] = status;
    if (input) updateObj['input'] = input;
    if (output) updateObj['output'] = output;
    if (expected) updateObj['expected'] = expected;

    await db
      .update(submissionsTable)
      .set(updateObj)
      .where(eq(submissionsTable.submissionId, submissionId));
  }

  async getSubmissions(userId: string, problemId: string | undefined) {
    let data = null;
    if (problemId) {
      data = await db
        .select()
        .from(submissionsTable)
        .where(
          and(
            eq(submissionsTable.userId, userId),
            eq(submissionsTable.problemId, problemId)
          )
        );
    } else {
      data = await db
        .select()
        .from(submissionsTable)
        .where(eq(submissionsTable.userId, userId));
    }
    return data;
  }

  async pushSubmissionToKafka(userId: string, problemId: string) {
    let message = { userId, problemId } as MessageType;
    producer.push(message);
  }
}

export default SubmissionService;
