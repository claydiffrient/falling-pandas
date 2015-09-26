import { Router } from 'express';
let router = Router();
// import api from './api';
import thinky from 'thinky';

let myThinky = thinky({
  host: 'localhost',
  port: '28015',
  db: 'pandas',
  expressPort: process.env.PORT || 4000
});

let { r, type } = myThinky;

// Game model
let Game = myThinky.createModel('Game', {
  id: type.string(),
  numPlayers: type.number().default(0),
  status: type.string().enum(['accepting', 'active', 'complete']).default('accepting'),
  date: type.date().default(r.now())
});

let api = {};

api.listGames = (req, res) => {
  Game.run().then((game) => {
    res.json(game);
  });
};

api.createGame = (req, res) => {
  let game = new Game(req.body);

  game.save().then((result) => {
    res.json(result);
  });
};




// Game Routes
router.get('/api/games', api.listGames);
// router.get('/api/games/:id', api.listGame);
router.post('/api/games', api.createGame);
// router.put('/api/games/:id', api.updateGame);
// router.delete('/api/games/:id', api.deleteGame);


export default router;
