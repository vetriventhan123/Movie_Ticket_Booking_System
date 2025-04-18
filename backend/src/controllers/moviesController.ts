import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

export const getMovies = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const [rows]: any = await pool.query('SELECT id, title, duration, rating FROM movies'); // Select specific fields
        res.json(rows);
    } catch (err) {
        next(err); // Pass error to the global error handler
    }
};

export const getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    const movieId = req.params.id;
    if (isNaN(Number(movieId))) {
        return res.status(400).json({ error: 'Invalid movie ID format' });
    }
    try {
        const [rows]: any = await pool.query('SELECT id, description, title, duration, rating FROM movies WHERE id = ?', [movieId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err); // Pass error to the global error handler
    }
};