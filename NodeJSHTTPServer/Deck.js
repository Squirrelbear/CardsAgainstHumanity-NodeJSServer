const cardData = require('./carddata.json').cardData;

/*
Holds the data for all question and answer cards.

@author: Peter Mitchell
@version: 2022.1
 */
class Deck {
    questions = [];
    answers = [];

    // Initialises the Deck by filtering all question and answer cards into separate arrays.
    constructor() {
        for(let i = 0; i < cardData.length; i++) {
            if(cardData[i].cardType === "Q") {
                this.questions.push(cardData[i]);
            } else {
                this.answers.push(cardData[i]);
            }
        }

        console.log(`Loaded ${ this.questions.length } questions and ${ this.answers.length } answers.`);
    }

    // Gets an array containing all the questionIDs that link to the questions in the deck.
    getAllQuestionIDs() {
        let questionIDs = [];
        for(let i = 0; i < this.questions.length; i++) {
            questionIDs.push(this.questions[i].id);
        }
        return questionIDs;
    }

    // Gets an array containing all the answerIDs that link to answers in the deck.
    getAllAnswerIDs() {
        let answerIDs = [];
        for(let i = 0; i < this.answers.length; i++) {
            answerIDs.push(this.answers[i].id);
        }
        return answerIDs;
    }

    // Takes a list of unused questions and draws a card randomly from the set and returns the full card data.
    getNextQuestion(unusedQuestions) {
        return this.drawFromDeck(unusedQuestions, this.questions);
    }

    // Takes a list of unused answers and draws a card randomly from the set and returns the full card data.
    drawCard(unusedAnswers) {
        return this.drawFromDeck(unusedAnswers, this.answers);
    }

    // Draws a random card id and finds it in the dataset then returns the full card data.
    drawFromDeck(unusedCards, cardDataSet) {
        let cardID = unusedCards[Math.floor(Math.random() * unusedCards.length)];
        let card = cardDataSet.find(c => c.id === cardID);

        if(card === undefined) {
            throw "Critical error: No card found??? " + cardID + " " + cardDataSet[0].cardType;
        } else {
            return card;
        }
    }
}

module.exports = Deck;