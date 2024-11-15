import express from 'express';
import { GeocodeController } from './interfaces/controllers/GeocodeController';
import { WeatherController } from './interfaces/controllers/WeatherController';

const app = express();
const PORT = process.env.PORT ?? 3000;

const geocodeController = new GeocodeController();
const weatherController = new WeatherController();

app.use(express.json());

app.get('/weather', async (req: express.Request, res: express.Response) => {
    await weatherController.getWeather(req, res);
});

app.get('/cities', async (req: express.Request, res: express.Response) => {
    await geocodeController.getGeocode(req, res);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export default app;