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
    deck.gameId = result.id;
    deck.save().then((deckSave) => {
      res.json(result);
    })

  });
};

/**
 * @api {get} /games Gets a list of games
 * @apiName GetGames
 * @apiGroup Game
 * @apiVersion 1.0.0
 */
export let listGames = (req, res) => {
  Game.getJoin({players: true, deck:{cards:true}}).then((game) => {
    res.json(game);
  });
};

let _generateCards = (numPlayers) => {
  let cards = [];

  for (let i = 0; i < 5; i++) {
    // 5 favors
    Card.filter({action: 'favor'}).slice(0, 1).run().then((card) => {
      cards.push(card);
    });
    // 5 attacks
    Card.filter({action: 'attack'}).slice(0, 1).run().then((card) => {
      cards.push(card);
    });
    // 5 nopes
    Card.filter({action: 'nope'}).slice(0, 1).run().then((card) => {
      cards.push(card);
    });
    // 5 shuffles
    Card.filter({action: 'shuffle'}).slice(0, 1).run().then((card) => {
      cards.push(card);
    });
    // 5 skips
    Card.filter({action: 'skip'}).slice(0, 1).run().then((card) => {
      cards.push(card);
    });
    // 5 futures
    Card.filter({action: 'future'}).slice(0, 1).run().then((card) => {
      cards.push(card);
    });
  }

  // 1 less than the numPlayers for the number of explodes
  for (let i = 0; i < numPlayers - 1; i++) {
    Card.filter({action: 'explode'}).slice(0,1).run().then((card) => {
      cards.push(card);
    });
  }

  // 5 - numPlayers for the number of defuses in the deck
  for (let i = 0; i < 5 - numPlayers; i++) {
    Card.filter({action: 'defuse'}).slice(0,1).run().then((card) => {
      cards.push(card);
    });
  }

  console.log(cards);

  return cards;
};

export let startGame = (req, res) => {
  Game.get(req.params.gameId)
      .getJoin({players: true, deck: true})
      .run()
      .then((game) => {
        console.log(game);
        if (game.numPlayers < 2) {
          return res.json({error: 'You need at least 2 players.'});
        }
        game.status = 'active';
        game.deck.cards = _generateCards(game.numPlayers);

        game.save().then((game) => {
          game.deck.save((decksave) => {
            res.json(game);
          });
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
