const Deck = require('./Deck.js');
deck = new Deck();

/*
This class handles the state of a single game session.

@author: Peter Mitchell
@version: 2022.1
 */
class GameSession {
    players = [];
    playerID = 0;
    lastRoundWinner = -1;
    undrawnAnswers = [];
    undrawnQuestions = [];
    currentRound = {};

    // Initialises a server with no players with a unique sessionCode.
    constructor(sessionID, sessionCode) {
        this.sessionID = sessionID;
        this.sessionCode = sessionCode;
        this.lastActivityTime = new Date();
    }

    // Adds the specified player to the game, player name must be unique.
    addPlayer(playerName, playerAuth) {
        this.lastActivityTime = new Date();
        let found = false;
        this.players.forEach(player => {
            if(player.name === playerName) {
                found = true;
            }
        });

        if(found) {
            return {error : "Found existing player name."};
        }

        this.players.push({
            name : playerName,
            playerID : this.playerID,
            playerAuth : playerAuth,
            score : 0,
            hand : []
        });
        this.playerID++;
        return {playerID : this.playerID-1};
    }

    // Removes the specified player from the player list.
    removePlayer(playerID) {
        this.lastActivityTime = new Date();
        this.players = this.players.filter(player => player.playerID !== playerID);
        // TODO need to handle what happens when a player is removed mid-game.
    }

    // Selects a winner and starts the next round.
    selectWinner(playerID) {
        this.lastActivityTime = new Date();
        this.lastRoundWinner = playerID;
        // TODO get the player and increase their score.
        console.log(this.sessionCode + " winner is " + playerID);
        this.startNextRound();
    }

    // Plays all the specified cards and removes them from the user's hand.
    playCards(playerID, cards) {
        this.lastActivityTime = new Date();
        let player = this.players.find(p => p.playerID === playerID);
        /*if(this.currentRound.czar === playerID) {
            console.log("Player is the czar, not allowed to play a card.");
            // TODO add back in after debugging
            //return;
        }else*/ if(this.currentRound.playedCards.find(data => data.playerID === playerID) !== undefined) {
            console.log("Player already played cards for this round.");
            return;
        }

        let cardsToAdd = [];
        cards.forEach(cardID => {
            let card = player.hand.find(c => c.id === cardID);
            if(card === undefined) {
                throw "Card does not exist!";
            }
            player.hand = player.hand.filter(c => c.id !== cardID);
            cardsToAdd.push(card);
        });
        this.currentRound.playedCards.push({
            playerID : player.playerID,
            played : cardsToAdd
        });
    }

    // Starts a new round by filling all hands back to 10 cards and rotating the czar to a new player.
    startNextRound() {
        this.lastActivityTime = new Date();
        this.fillAllHands();
        let czarID = 0;
        if(this.currentRound.czar === undefined) {
            let player = this.players[Math.floor(Math.random() * this.players.length)];
            czarID = player.playerID;
        } else {
            for(let i = 0; i < this.players.length; i++) {
                if(this.players[i].playerID === this.currentRound.czar) {
                    if(i+1 < this.players.length) {
                        czarID = this.players[i+1].playerID;
                    } else {
                        czarID = this.players[0].playerID;
                    }
                    break;
                }
            }
        }
        this.currentRound = {
            question : this.drawQuestion(),
            czar : czarID,
            playedCards : []
        };
        console.log(this.sessionCode + " started a new round with czar " + czarID + ".");
    }

    // Fills all player hands until they reach 10 cards each.
    fillAllHands() {
        this.players.forEach(player => {
            while(player.hand.length < 10) {
                player.hand.push(this.drawAnswer());
            }
        });
    }

    // Gets a new question from the deck.
    drawQuestion() {
        if(this.undrawnQuestions.length === 0) {
            this.undrawnQuestions = deck.getAllQuestionIDs();
        }

        let card = deck.getNextQuestion(this.undrawnQuestions);
        if(card === undefined) {
            throw "Invalid card drawn!";
        }
        this.undrawnQuestions = this.undrawnQuestions.filter(questionCard => questionCard !== card.id);
        return card;
    }

    // Gets a new answer card from the deck.
    drawAnswer() {
        if(this.undrawnAnswers.length === 0) {
            this.undrawnAnswers = deck.getAllAnswerIDs();
        }

        let card = deck.drawCard(this.undrawnAnswers);
        if(card === undefined) {
            throw "Invalid card drawn!";
        }
        this.undrawnAnswers = this.undrawnAnswers.filter(answerCard => answerCard !== card.id);
        return card;
    }

    // Gets the data for a specified playerID including the lastRoundWinner, their hand, and currentRound data.
    getDataForPlayer(playerID) {
        this.lastActivityTime = new Date();

       for(let i = 0; i < this.players.length; i++) {
           if(this.players[i].playerID === playerID) {
               return {
                    lastRoundWinner : this.lastRoundWinner,
                    hand : this.players[i].hand,
                    currentRound : this.currentRound
               };
           }
       }

       return {error : "Unknown player."};
    }

    // Gets the difference between the current time and last time an action was attempted for this session.
    getTimeSinceLastInteraction() {
        let endTime = new Date();
        let timeDiff = endTime - this.lastActivityTime;
        // convert from ms to seconds
        timeDiff /= 1000;

        return Math.round(timeDiff);
    }

    // Returns any player that has the specified auth code within this session.
    getPlayerWithAuth(playerAuth) {
        return this.players.find(p => p.playerAuth === playerAuth);
    }
}

module.exports = GameSession;