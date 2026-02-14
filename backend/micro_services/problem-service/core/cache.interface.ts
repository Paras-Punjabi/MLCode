export interface LFUCache {
  push(key: string, value: Object): Promise<void>;
  pop(key: string): Promise<void>;
  get(key: string): Object;
}

export interface Cache {
  get(key: string): Object;
  set(key: string, ttl: number, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
