import { TENNIS_GAME_SCORE } from "./constants"
import { Player } from "./types/player.type"
import { Point, Set } from "./types/scoring.type"

export class Match {

    // @Private Properties
    private _player1: Player

    private _player2: Player
   
    private _match: Set    //hold the match scoring in case we wantto persist the match history


    /**
     * Constructor
     */
    public constructor(player1: Player, player2: Player) { 

        //set the players for the match
        this._player1 = player1
        this._player2 = player2

        //init the match scoring which is 1 set of games and a possible tie break
        this._match = {
            games: [
                []
            ]
        }

    }


    //--------------------------------------------------------------------------------
    // @Public Methods
    //--------------------------------------------------------------------------------

    /**
     * Method for record who won the point
     */
    public pointWonBy(playerSlug: string) {

        if(this._match.tieBreak) {
            this._match.tieBreak.push({wonBy: playerSlug})
        } else {
            //add the point to the current game
            this._getCurrentGame().push({wonBy: playerSlug})
        }

        this._updateMatch()
    }

    /**
     * 
     */
    public score(): string {

        //check whether there is a tie break and add to that
        let gameScore = '';
        if(this._match.tieBreak) {

            if(this._match.tieBreak.length === 0) {
                gameScore = 'Playing tie break'
            } else {
                let tbScore = this._getGameScore(this._match.tieBreak)
                gameScore = `${tbScore[0]}-${tbScore[1]} (tie break)`
            }


        } else {
            gameScore = this._getGameSummary(this._getCurrentGame())
            
        }

        const setScore = this._getSetScore();

        //return the score for the match so far
        return `${setScore[0]}-${setScore[1]}, ${gameScore}` 
    }

    /**
     * Method to determine the match is over 
     */
    public isMatchOver(): boolean {
        return this._hasMatchBeenWon()
    }

    //--------------------------------------------------------------------------------
    // @Private Methods
    //--------------------------------------------------------------------------------

    /**
     * Determines if the match has been won by someone
     */    
    private _hasMatchBeenWon() {

        if(this._match.tieBreak) {
            //the match has a tie break, so the first to 7 points wins the match
            return this._isGameWon(this._match.tieBreak, true)
        } else {
            const [a,b] = this._getSetScore();

            //first to 6 games wins the set, but must be 2 games ahead
            if((a >= 6 || b >= 6) && Math.abs(a-b) >= 2) {
                return true
            } else {
                return false;
            }
    
        }


    }

    /**
     * 
     */
    private _isGameWon(game: Point[], tieBreak: boolean = false) {
        let [a,b] = this._getGameScore(game);

        //do the check is the fame is won.  For  a tie break they have to get to seven points won, else for a normal game then it is 4 points
        return (a >= (tieBreak ? 7 : 4) || b >= (tieBreak ? 7 : 4)) && Math.abs(a-b) >= 2            

    }

    /**
     * Get the Current game from the match
     */
    private _getCurrentGame(): Point[] {
        return this._match.games[this._match.games.length - 1]
    }

    /**
     * get the current game score from the match
     */
    private _getGameScore(game: Point[]) {
        const [a,b] = [this._player1, this._player2].map((player: Player) => game.filter((point: Point) => point.wonBy === player.slug).length)
        return [a,b]
    }

    /**
     * get the game summary including using the tennis weird scoring system, deuce amd advantage
     */
    private _getGameSummary(game: Point[]) {
        if(this._hasMatchBeenWon() || game.length === 0 || this._isGameWon(game)) {
            return '';
        }   

        let [a,b] = this._getGameScore(game);

        if(a >= 3 && b >= 3) {
            if(a === b) {
                return 'DEUCE'
            } else {
                return `ADVANTAGE ${a > b ? this._player1.name : this._player2.name}`
            }
        } else {
            return `${TENNIS_GAME_SCORE.get(a)}-${TENNIS_GAME_SCORE.get(b)}`
        }

    }

    /**
     * Determines whether player 1 won the game or not
     */
    private _didPlayer1WinGame(game: Point[]) {
        const [a,b] = this._getGameScore(game)

        return a > b
    }

    /**
     * get the set score
     */
    private _getSetScore() {
        let [a,b] = Object.assign(this._match.games).reduce((acc: [ number, number ], game: Point[]) => {
            
            if(!this._isGameWon(game)) {
                return acc
            }

            const r = this._didPlayer1WinGame(game)
            return [acc[0] + (r ? 1 : 0), acc[1] + (r ? 0 : 1)]
        }, [0,0])

        return ([a,b])
    }

    /**
     * update the match
     */
    private _updateMatch() {

        //Don't update anything if we are in a tie breal
        if(!this._match.tieBreak) {

            if(this._isGameWon(this._getCurrentGame())) {

                //before we add a new game, we need to check if the set has been won or needs a tie break
                if(!this._hasMatchBeenWon()) {
                    //does the set need a tie break?
                    const [a,b] = this._getSetScore();


                    if(a === 6 && b === 6) {
                        Object.assign(this._match, { tieBreak: []})
                    } else {
                        this._match.games.push([])
                    }
                }

            } 

        }
       
    }

}