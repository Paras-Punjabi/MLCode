import { KafkaProducer, MessageType } from '../services/kafka.service';
import config from '../../configs/dotenv.config';

const producer = new KafkaProducer(
  {
    allowAutoTopicCreation: true,
  },
  config.KAFKA_TOPIC
);

(async () => {
  const userId = process.argv[2];
  const problemId = process.argv[3];
  const message: MessageType = { userId, problemId };
  await producer.push(message);
})();
