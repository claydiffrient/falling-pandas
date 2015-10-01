import { Game, Player, Deck, Card, Hand } from '../models';

/**
 * @api {post} /games Create a new game
 * @apiName CreateGame
 * @apiGroup Game
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object} game          An object representing the game
 * @apiSuccess {String} game.id       The game id
 * @apiSuccess {String} game.status   The current status of the game [accepting, active, complete]
 * @apiSuccess {Date}   game.date     The date the game started
 *
 */
export let createGame = (req, res) => {
  let game = new Game({});
  let deck = new Deck({});

  game.deck = deck;

  game.save().then((result) => {
    res.json(result);
  });
};

/**
 * @api {get} /games Gets a list of games
 * @apiName GetGames
 * @apiGroup Game
 * @apiVersion 1.0.0
 */
export let listGames = (req, res) => {
  Game.getJoin().then((game) => {
    res.json(game);
  });
};

let _generateCards = () => {
  let cards = [];
  // 5 favors
  for (let i = 0; i < 5; i++) {
    Card.get('favor').run().then((card) => {
      cards.push(card);
    });
  }
  // 5 attacks
  for (let i = 0; i < 5; i++) {
    Card.get('attack').run().then((card) => {
      cards.push(card);
    });
  }

  return cards;
};

export let startGame = (req, res) => {
  Game.get(req.params.gameId)
      .getJoin()
      .run().
      then((game) => {
        game.status = 'active';
        game.deck = game.deck || new Deck({});
        game.deck.cards = _generateCards();

        game.save().then((game) => {
          res.json(game);
        });
      });
};

/**
 * @api {post} /games/:id/players Create a new game
 * @apiName CreatePlayer
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object} player        An object representing the player
 * @apiSuccess {String} player.id     The player id
 * @apiSuccess {String} player.name   The name of the player
 * @apiSuccess {String} player.gameId The id of the game the player belongs to.
 *
 *
 */
export let createPlayer = (req, res) => {
  let player = new Player({
    gameId: req.params.gameId,
    name: req.body.name
  });

  player.save().then((result) => {
    res.json(result);
  });
};


export default {
  listGames,
  createGame,
  startGame,
  createPlayer
};
