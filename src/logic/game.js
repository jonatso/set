function createDeck() {
  //generate deck
  let deck = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          deck.push([i, j, k, l]);
        }
      }
    }
  }
  //shuffle with Fisher-Yates
  let currentIndex = deck.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = temporaryValue;
  }
  return deck;
}

function isSet(card1, card2, card3) {
  //check if cards are a set
  for (let i = 0; i < 4; i++) {
    if ((card1[i] + card2[i] + card3[i]) % 3 !== 0) {
      return false;
    }
  }
  return true;
}

function findSet(board) {
  //check if board contains a set
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      for (let k = j + 1; k < board.length; k++) {
        if (isSet(board[i], board[j], board[k])) {
          return [i, j, k];
        }
      }
    }
  }
  return null;
}

function makeBoard(deck) {
  //make board
  let board = [];
  for (let i = 0; i < 12; i++) {
    board.push(deck.pop());
  }
  return board;
}

export { createDeck, isSet, findSet, makeBoard };
