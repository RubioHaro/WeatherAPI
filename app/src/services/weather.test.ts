import { getWeather, CoordinateUtils } from "./weather";
import * as redis from "redis";
import axios from "axios";

jest.mock("redis", () => ({
    createClient: jest.fn().mockReturnValue({
        connect: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
    }),
}));

// Mock Axios
jest.mock("axios");

describe("Weather Service", () => {
    let redisClient: any;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        redisClient = redis.createClient();
    });
    
    /*

        Here I would add tests for the getWeather function 

        Possible test cases:
        - validate the invalid coordinates.
        - validate the valid coordinates.
        - validate providers failure, currently not handled in the code.
        - validate retry mechanism (todo: implementation).
    
    */

    describe("CoordinateUtils", () => {
        describe("roundCoordinates", () => {
            it("should round coordinates to specified precision", () => {
                const testCases = [
                    {
                        input: { lat: 40.7128, lon: -74.006, precision: 1 },
                        expected: "40.7,-74",
                    },
                    {
                        input: { lat: 40.7128, lon: -74.006, precision: 2 },
                        expected: "40.71,-74.01",
                    },
                    {
                        input: { lat: 40.7128, lon: -74.006, precision: 0 },
                        expected: "41,-74",
                    },
                ];

                testCases.forEach(({ input, expected }) => {
                    const result = CoordinateUtils.roundCoordinates(
                        input.lat,
                        input.lon,
                        input.precision
                    );
                    expect(result).toBe(expected);
                });
            });
        });

        describe("getGridArea", () => {
            it("should return coordinates rounded to 1 decimal place", () => {
                const result = CoordinateUtils.getGridArea(40.7128, -74.006);
                expect(result).toBe("40.7,-74");
            });
        });
    });
});
