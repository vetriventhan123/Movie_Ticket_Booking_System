import express from 'express';
import { getMovies, getMovieById } from '../controllers/moviesController';

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);

export default router;