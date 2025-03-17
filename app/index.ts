import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import weatherController from "./src/controllers/weather";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use('/', weatherController);


app.listen(port, () => {
    console.log(`Server is Fire at https://localhost:${port}`);
});
