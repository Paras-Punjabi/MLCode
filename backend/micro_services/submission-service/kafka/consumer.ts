import { EachMessagePayload } from 'kafkajs';
import { KafkaConsumer } from '../services/kafka.service';
import config from '../../configs/dotenv.config';
import VerifySubmissionPipeline from '../utils/verifySubmission.utils';

export default class SubmissionServiceKafkaConsumer {
  private consumer!: KafkaConsumer;
  async consumeMessageCallback(payload: EachMessagePayload) {
    let payloadData = JSON.parse(payload.message.value?.toString() as string);
    let pipeline = new VerifySubmissionPipeline(
      payloadData['userId'],
      payloadData['problemSlug']
    );
    await pipeline.runPipeline();
    await this.consumer.commit({
      partition: payload.partition,
      topic: payload.topic,
      offset: (Number(payload.message.offset) + 1).toString(),
    });
  }

  async listen() {
    this.consumer = new KafkaConsumer(
      {
        groupId: 'mlcode-worker',
        allowAutoTopicCreation: true,
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      },
      [config.KAFKA_TOPIC]
    );
    console.log('✅ Kafka Consumer Started');
    await this.consumer.listen(this.consumeMessageCallback.bind(this));
  }
}
