import { Request, Response, Router } from "express";
import { getWeather } from "../services/weather";

const weatherController = Router();

weatherController.get("/weather", async (req: Request, res: Response) => {
    let lat = parseFloat(req.query.lat as string);
    let lon = parseFloat(req.query.lon as string);

    if (!lat || !lon) {
        const cords = req.query.cords as string;
        if (cords) {
            const cordsarray = cords.split(",");
            lat = parseFloat(cordsarray[0]);
            lon = parseFloat(cordsarray[1]);
        } else {
            res.status(400).json({
                error: "Latitude and longitude parameters are required",
            });
            return;
        }
    }

    try {
        const weather = await getWeather(lat, lon);
        res.json(weather);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el clima" });
    }
});

export default weatherController;
