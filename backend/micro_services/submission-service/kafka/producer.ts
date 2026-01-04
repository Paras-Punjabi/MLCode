import { KafkaProducer, MessageType } from '../services/kafka.service';
import config from '../../configs/dotenv.config';
import { Partitioners } from 'kafkajs';

const producer = new KafkaProducer(
  {
    allowAutoTopicCreation: true,
    createPartitioner: Partitioners.LegacyPartitioner,
  },
  config.KAFKA_TOPIC
);

(async () => {
  const userId = process.argv[2];
  const problemId = process.argv[3];
  const message: MessageType = { userId, problemId };
  await producer.push(message);
})();
