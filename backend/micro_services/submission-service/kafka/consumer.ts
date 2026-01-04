import { EachMessagePayload } from 'kafkajs';
import { KafkaConsumer } from '../services/kafka.service';
import config from '../../configs/dotenv.config';
import VerifySubmissionPipeline from '../utils/verifySubmission.utils';

const consumer = new KafkaConsumer(
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

async function consumeMessageCallback(payload: EachMessagePayload) {
  let payloadData = JSON.parse(payload.message.value?.toString() as string);
  // let pipeline = new VerifySubmissionPipeline(
  //   payloadData['userId'],
  //   payloadData['problemId']
  // );
  // await pipeline.runPipeline();
  console.log(payloadData);
  await consumer.commit({
    partition: payload.partition,
    topic: payload.topic,
    offset: (Number(payload.message.offset) + 1).toString(),
  });
}

export async function consumeMessages() {
  console.log('✅ Kafka Consumer Started');
  await consumer.listen(consumeMessageCallback);
}

consumeMessages();
