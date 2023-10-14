import RedisClient from '@redis/client/dist/lib/client';
import * as redis from 'redis';

export class RedisService {

    public static client = redis.createClient({
        url: process.env.REDIS_URL,
    });

    public static MINUTE = 60;
    public static HOUR = 60 * 60;
    public static DAY = 60 * 60 * 24;
    public static WEEK = RedisService.DAY * 7;
    public static MONTH = RedisService.DAY * 30;
    public static YEAR = RedisService.DAY * 365;
    

    public static async init() {

        this.client.on("error", (error) => console.error(`Error : ${error}`));
         
        await this.client.connect();
    }

    public static async remember(key: string, time: number = -1, func: () => Promise<any>) {
        const cachedValue = await this.client.get(key);

        if (cachedValue) {
            return JSON.parse(cachedValue);
        }

    
      
        const result = await func();

        const options  = {}

        if (time > 0) {
            options['ex'] = time;
        }

        this.client.set(key, JSON.stringify(result), options);

        return result;
    }

    public static async forget(key: string) {
        this.client.del(key);
    }
}