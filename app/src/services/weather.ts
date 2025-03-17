import * as redis from "redis";
import axios from "axios";

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.connect();

export async function getWeather(lat: number, lon: number) {
    const precision = 1; // 1 decimal precision

    const gridArea = CoordinateUtils.roundCoordinates(lat, lon, precision);
    const cachedWeather = await redisClient.get(`weather:grid=${gridArea}`);

    if (cachedWeather) {
        console.log("Returning cached weather by coordinates: ", gridArea);
        return {
            ...JSON.parse(cachedWeather),
            cached: true,
        };
    }

    const response = await axios.get(
        `https://api.weather.gov/points/${lat},${lon}`
    );

    const weather = response.data;
    await redisClient.set(`weather:grid=${gridArea}`, JSON.stringify(weather), {
        // 24 hour expiration
        EX: 60 * 60 * 24,
    });

    console.log("Returning fresh weather by coordinates, new grid: ", gridArea);

    return weather;
}

export class CoordinateUtils {
    static roundCoordinates(
        lat: number,
        lon: number,
        precision: number = 1
    ): string {
        const roundedLat = Number(lat.toFixed(precision));
        const roundedLon = Number(lon.toFixed(precision));
        return `${roundedLat},${roundedLon}`;
    }
    static getGridArea(lat: number, lon: number): string {
        return this.roundCoordinates(lat, lon, 1);
    }
}
