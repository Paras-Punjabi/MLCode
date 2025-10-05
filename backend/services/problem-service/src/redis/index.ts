import Redis from 'ioredis';
import config from '../configs/dotenv.config';

export default class LFURedisCache {
  client: Redis;
  sortedSetName: string;
  hashSetName: string;
  initalFrequency: number;
  maxLength: number;

  constructor() {
    this.client = new Redis(config.REDIS_URI);
    this.sortedSetName = config.REDIS_SORTED_SET_NAME;
    this.hashSetName = config.REDIS_HASHSET_NAME;
    this.initalFrequency = 1;
    this.maxLength = 3;
  }

  async getCurrentLength() {
    return await this.client.zcard(this.sortedSetName);
  }

  async incrementFrequency(id: string) {
    let frequency_string = await this.client.zscore(this.sortedSetName, id);
    if (frequency_string != null) {
      let frequency = parseInt(frequency_string);
      await this.client.zrem(this.sortedSetName, id);
      await this.client.zadd(this.sortedSetName, frequency + 1, id);
    }
  }

  async push(id: string, value: Object) {
    let value_string = JSON.stringify(value);
    let frequency_string = await this.client.zscore(this.sortedSetName, id);
    if (frequency_string != null) {
      let frequency = parseInt(frequency_string);
      await this.client.zrem(this.sortedSetName, id);
      await this.client.zadd(this.sortedSetName, frequency + 1, id);
    } else {
      let currentLength = await this.getCurrentLength();
      if (currentLength >= this.maxLength) {
        await this.pop();
      }
      this.client.zadd(this.sortedSetName, this.initalFrequency, id);
      this.client.hset(this.hashSetName, id, value_string);
    }
  }

  async get(id: string) {
    let frequency = await this.client.zscore(this.sortedSetName, id);
    if (frequency == null) return null;
    await this.incrementFrequency(id);
    return JSON.parse((await this.client.hget(this.hashSetName, id)) as string);
  }

  async pop() {
    // *Least Frequency Element will be popped from the cache
    let leastFrequencyIds = await this.client.zrange(this.sortedSetName, 0, 0);
    if (leastFrequencyIds.length > 0) {
      let leastFrequencyId = leastFrequencyIds[0];
      await this.client.zrem(this.sortedSetName, leastFrequencyId);
      await this.client.hdel(this.hashSetName, leastFrequencyId);
    }
  }
}
