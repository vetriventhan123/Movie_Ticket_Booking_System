import express from 'express';
import bodyParser from 'body-parser';
import movieRoutes from './routes/movies';
import bookingRoutes from './routes/bookings';

const app = express();

app.use(bodyParser.json());

// Enable CORS for all routes (consider restricting in production)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001; // Changed port to 3001 to avoid conflict with React default
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});