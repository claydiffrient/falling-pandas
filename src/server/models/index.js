import Thinky from 'thinky';
import config from 'config';

let thinky = Thinky(config.get('Db'));

let { r, type } = thinky;

// Game model
export let Game = thinky.createModel('Game', {
  id: type.string(),
  numPlayers: type.number().default(0),
  status: type.string().enum(['accepting', 'active', 'complete']).default('accepting'),
  date: type.date().default(r.now())
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

// Deck model
export let Deck = thinky.createModel('Deck', {
  id: type.string(),
  gameId: type.string().required()
});

// Hand model
export let Hand = thinky.createModel('Hand', {
  id: type.string(),
  playerId: type.string().required()
});

/**
 * Associations
 */

// Game has many players
Game.hasMany(Player, 'players', 'id', 'gameId');
Player.belongsTo(Game, 'game', 'gameId', 'id');

// Game has one deck
Game.hasOne(Deck, 'deck', 'id', 'gameId');
Deck.belongsTo(Game, 'game', 'gameId', 'id');

// A Deck has many cards
Deck.hasMany(Card, 'cards', 'id', 'cardId');
Card.belongsTo(Deck, 'deck', 'cardId', 'id');

// A player has a hand
Player.hasOne(Hand, 'hand', 'id', 'playerId');
Hand.belongsTo(Player, 'player', 'playerId', 'id');

// A Hand has many cards
Hand.hasMany(Card, 'cards', 'id', 'cardId');
Card.belongsTo(Hand, 'hand', 'cardId', 'id');