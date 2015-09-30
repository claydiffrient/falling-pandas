import { Router } from 'express';
let router = Router();
import api from './api';
import createCards from '../createCards';

// Game Routes
router.get('/api/games', api.listGames);
// router.get('/api/games/:id', api.listGame);
router.post('/api/games', api.createGame);
router.post('/api/games/:gameId/players', api.createPlayer);
router.put('/api/games/:gameId/start', api.startGame);
// router.put('/api/games/:id', api.updateGame);
// router.delete('/api/games/:id', api.deleteGame);

// initialization routes
router.get('/api/init', createCards);

export default router;
