import Thinky from 'thinky';
import config from 'config';

let thinky = Thinky(config.get('Db'));

let { r, type } = thinky;

// Game model
export let Game = thinky.createModel('Game', {
  id: type.string(),
  numPlayers: type.number().default(0),
  status: type.string().enum(['accepting', 'active', 'complete']).default('accepting'),
  date: type.date().default(r.now()),
});

// Player model
export let Player = thinky.createModel('Player', {
  id: type.string(),
  name: type.string().required(),
  gameId: type.string().required()
});

const CARD_ACTIONS = [
    'shuffle',
    'future',
    'skip',
    'attack',
    'favor',
    'nope',
    'defuse',
    'explode'
  ];

// Card model
export let Card = thinky.createModel('Card', {
  id: type.string(),
  name: type.string().required(),
  action: type.string().enum(CARD_ACTIONS)
});

/**
 * Associations
 */

// Game has many players
Game.hasMany(Player, 'players', 'id', 'gameId');
Player.belongsTo(Game, 'game', 'gameId', 'id');

// A Game has many cards (via deck game attribute)
// Game.hasMany(Card, 'deck', )
