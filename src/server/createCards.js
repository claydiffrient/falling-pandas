/**
 * Used to initialize the database with cards
 */

import { Card } from './models';

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

export default function createCards (req, res) {
  let promises = CARD_ACTIONS.map((action) => {
    let card = new Card({
      name: action,
      action: action
    });

    return card.save();
  });

  Promise.all(promises).then(() => {
    res.json({
      success: true
    });
  });
};
