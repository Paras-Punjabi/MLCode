import {
  Consumer,
  ConsumerConfig,
  EachMessageHandler,
  EachMessagePayload,
  Kafka,
  Producer,
  ProducerConfig,
  TopicPartitionOffsetAndMetadata,
} from 'kafkajs';
import config from '../../configs/dotenv.config';

export type MessageType = {
  userId: string;
  problemSlug: string;
};

export class KafkaService {
  protected kafka: Kafka;
  constructor() {
    this.kafka = new Kafka({
      brokers: config.KAFKA_BROKERS.split(','),
      clientId: 'mlcode-kafka',
    });
  }

  protected getKafkaProducer(config: ProducerConfig) {
    return this.kafka.producer(config);
  }

  protected getKafkaConsumer(config: ConsumerConfig) {
    return this.kafka.consumer(config);
  }
}

export class KafkaProducer extends KafkaService {
  protected producer: Producer;
  protected kafkaTopic: string;
  protected isConnected: boolean;

  constructor(config: ProducerConfig, kafkaTopic: string) {
    super();
    this.producer = this.getKafkaProducer(config);
    this.kafkaTopic = kafkaTopic;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;
    await this.producer.connect();
  }

  async push(message: MessageType) {
    await this.connect();
    let messageValue = JSON.stringify(message);
    this.producer
      .send({
        topic: this.kafkaTopic,
        messages: [{ value: messageValue }],
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  async disconnect() {
    if (!this.isConnected) return;
    await this.producer.disconnect();
    this.isConnected = false;
  }
}

export class KafkaConsumer extends KafkaService {
  protected consumer: Consumer;
  protected isConnected: boolean;
  protected kafkaTopics: string[];

  constructor(config: ConsumerConfig, kafkaTopics: string[]) {
    super();
    this.consumer = this.getKafkaConsumer(config);
    this.isConnected = false;
    this.kafkaTopics = kafkaTopics;
  }
  async connect() {
    if (this.isConnected) return;
    await this.consumer.connect();
    await this.consumer.subscribe({ topics: this.kafkaTopics });
    this.isConnected = true;
  }
  async disconnect() {
    if (!this.isConnected) return;
    await this.consumer.disconnect();
    this.isConnected = false;
  }

  async listen(callback: EachMessageHandler) {
    await this.connect();
    this.consumer.run({
      autoCommit: false,
      eachMessage: async (payload: EachMessagePayload) => {
        console.log(
          `Topic: ${payload.topic} Message: ${payload.message.value?.toString()} Partition: ${payload.partition} Offset: ${payload.message.offset}`
        );
        await callback(payload);
      },
    });
  }

  async commit(message: TopicPartitionOffsetAndMetadata) {
    await this.consumer.commitOffsets([message]);
  }
}
