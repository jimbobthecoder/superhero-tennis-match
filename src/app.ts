import { Match } from './Match.class'
import { players } from "./players";


//get a list of the possible players - our superheros
let possiblePlayers = players

const player1 = possiblePlayers.splice(Math.floor(Math.random() * players.length), 1)[0];       //use splice on the possiblePlayers so the second player can't be the same as the first
const player2 = possiblePlayers[Math.floor(Math.random() * players.length)];      

//init the match
const match = new Match(player1, player2);      

//Welcome to the tennis match
console.log(`Welcome to the game of Tennis.  This match is between ${player1.name} and ${player2.name}.`);


//create teh loop for playing the match and continue unti the match is over and we have a winner!
do {

  //decode who won the point randomly
  const winningPlayer = [player1, player2][Math.floor(Math.random() * 2)]

  //record the point
  match.pointWonBy(winningPlayer.slug)

  //print the score to teh console
  console.log(`Point won by ${winningPlayer.name}.  Score is: ${match.score()}`)

  //go to sleep a little so people can follow the match 
  sleep(200)


} while(!match.isMatchOver())
    

/**
 * puts the thread to sleep for the specified number of milliseconds
 */
function sleep(milliseconds: number) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
