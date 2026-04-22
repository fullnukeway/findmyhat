// * Initializing the prompt-sync module to allow for user input in the terminal, with the option to handle SIGINT (Ctrl+C) gracefully.
import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true });

// * Setting the game elements/assets constants
const HAT = "^";
const HOLE = "O";
const GRASS = "░";
const PLAYER = "*";


// * Setting the constants for the user's input: UP / DOWN / LEFT / RIGHT / QUIT keyboard 
const UP = "W";
const DOWN = "S";
const LEFT = "A";
const RIGHT = "D";
const QUIT = "Q";


// * Setting the constants for the messages to show the user after their input: FEEDBACK_UP / FEEDBACK_DOWN / FEEDBACK_LEFT / FEEDBACK_RIGHT / FEEDBACK_ QUIT / FEEDBACK_INVALID
const FEEDBACK_UP = "You moved up!";
const FEEDBACK_DOWN = "You moved down!";
const FEEDBACK_LEFT = "You moved left!";
const FEEDBACK_RIGHT = "You moved right!";
const FEEDBACK_QUIT = "You have quit the game!";
const FEEDBACK_INVALID = "Invalid entry!";


// * Setting the constants for the messages to show the user after their move: FEEDBACK_WIN_MSG / FEEDBACK_LOSE_MSG / FEEDBACK_OUT_MSG / FEEDBACK_SAFE_MSG / FEEDBACK_QUIT_MSG
const FEEDBACK_WIN_MSG = "Congratulations! You won!";
const FEEDBACK_LOSE_MSG = "You fell into a hole. Game Over!";
const FEEDBACK_OUT_MSG = "You stepped out of the platform. Game Over!";
const FEEDBACK_SAFE_MSG = "You moved to a safe spot.";
const FEEDBACK_QUIT_MSG = "You have quit the game. Thank you for playing.";


// *Defining the const for the number of rows and columns for the game map + the percentage of holes to grass when generating the game map
const ROWS = 8;
const COLS = 5;
const PERCENT = 0.2; /* Percentage on the number of holes in the game map*/


// * Creating the Field class to create the game field and implement the game logic
class Field {

  // * Defining the constructor which is a built-in method of a class (invoked when an object of a class is instantiated)
  constructor(field = [[]]) {
    this.field = field;
    this.gamePlay = false;
  }


  // * Using generateField as a static method. This returns a 2D array of the fields.
  static generateField(rows, columns, percentage) {

    const map = [[]];

    for (let i = 0; i < rows; i++) {
      map[i] = [];                                          /* generate the row  for the map */

      for (let j = 0; j < columns; j++) {
        map[i][j] = Math.random() < PERCENT ? HOLE : GRASS; /* ~80% GRASS, ~20% HOLES */
      }

    }

    return map;                                             /* return the generated 2D array */
  }


  // * Using welcomeMessage as a static method to display a string
  static welcomeMsg(Msg) {
    console.log(Msg);
  }


  // * Using setHat method to position the hat along a random position in the game map (random x and y position within field array)
  setHat() {

    const x = Math.floor(Math.random() * (ROWS - 1) + 1); /* establish a random position of X in the field */

    const y = Math.floor(Math.random() * (COLS - 1) + 1); /* establish a random position of Y in the field */

    this.field[x][y] = HAT;                               /* set the HAT along the derived random position this.field[x][y] */

  }

  // * Using printField to join the elements in the game map together so that it looks nicer
  printField() {

    this.field.forEach(row => console.log(row.join(" "))); /* forEach method to iterate through each row of the field, and join method to display the elements of the row as a string with spaces in between */

  }

  // * Using updateMove method to display the move (key) entered by the user
  updateMove(direction) {
    console.log(direction);
  }


  // * Using updateGame method to handle the game logic based on user input
  updateGame(input) {

    // Replace the player's current position with GRASS before moving
    this.field[this.playerRow][this.playerCol] = GRASS;

    // Handle movement based on input
    switch (input) {
      
      case UP:
        if (this.playerRow > 0) {
          this.playerRow--;
        } else {
          console.log(FEEDBACK_OUT_MSG);
          this.#end();
          return;
        }
        break;

      case DOWN:
        if (this.playerRow < ROWS - 1) {
          this.playerRow++;
        } else {
          console.log(FEEDBACK_OUT_MSG);
          this.#end();
          return;
        }
        break;

      case LEFT:
        if (this.playerCol > 0) {
          this.playerCol--;
        } else {
          console.log(FEEDBACK_OUT_MSG);
          this.#end();
          return;
        }
        break;

      case RIGHT:
        if (this.playerCol < COLS - 1) {
          this.playerCol++;
        } else {
          console.log(FEEDBACK_OUT_MSG);
          this.#end();
          return;
        }
        break;

      default:
        console.log(FEEDBACK_INVALID);
        return;
    }

    // Check the position the player moved to
    const currentPosition = this.field[this.playerRow][this.playerCol];

    switch (currentPosition) {

      // If the player moves to a hole (i.e. x and y position of the player matches the x and y position of a hole), the game ends with a lose message
      case HOLE:
        console.log(FEEDBACK_LOSE_MSG);
        this.#end();
        return;

      // If the player moves to a grass (i.e. x and y position of the player matches the x and y position of a grass), the game continues with a safe message
      case GRASS:
        console.log(FEEDBACK_SAFE_MSG);
        break;

      // If the player moves to a hat (i.e. x and y position of the player matches the x and y position of the hat), the game ends with a win message 
      case HAT:
        console.log(FEEDBACK_WIN_MSG);
        this.#end();
        return;

      // If the player moves to an unknown tile type (i.e. x and y position of the player matches the x and y position of a tile that is not a hole, grass, or hat), the game ends with an unknown tile type message
      default:
        console.log("Unknown tile type!");
        this.#end();
        return;
    }

    // Update the player's position on the map
    this.field[this.playerRow][this.playerCol] = PLAYER;

  }

  //  * start() a public method of the class to start the game
  start() {
    this.gamePlay = true;

    // Set the player's initial position
    this.playerRow = 0;
    this.playerCol = 0;
    this.field[this.playerRow][this.playerCol] = PLAYER;

    // Set the hat's position on the field
    this.setHat();

    while (this.gamePlay) {
      // Print the current field
      this.printField();

      // Prompt the user for input
      const input = prompt("Enter (w)up, (s)down, (a)left, (d)right. Press (q) to quit: ");
      let flagInvalid = false; // Flag to track invalid input
      let feedback = "";

      // Handle the input
      switch (input.toUpperCase()) {
        case UP:
          feedback = FEEDBACK_UP;
          break;
        case DOWN:
          feedback = FEEDBACK_DOWN;
          break;
        case LEFT:
          feedback = FEEDBACK_LEFT;
          break;
        case RIGHT:
          feedback = FEEDBACK_RIGHT;
          break;
        case QUIT:
          console.log(FEEDBACK_QUIT);
          this.#end();
          return; // Exit the loop after ending the game
        default:
          feedback = FEEDBACK_INVALID;
          flagInvalid = true;
          break;

      }

      // Provide feedback for the input
      this.updateMove(feedback);

      // If the input is valid, update the game
      if (!flagInvalid) {
        this.updateGame(input.toUpperCase());
      }
    }
  }

  //  * end() a public method of the class to end the game
  #end() {
    this.gamePlay = false;
    process.exit(); // * Exiting the process to end the game
  }
}

// * Generate a new field - using Field's static method: generateField
const createField = Field.generateField(ROWS, COLS, PERCENT);

// * Generate a welcome message
Field.welcomeMsg("\n************WELCOME TO FIND YOUR HAT************\n");

// * Create a new instance of the game
// * by passing createField as a parameter to the new instance of Field
const gameField = new Field(createField);

// * Invoke method start(...) from the instance of game object
gameField.start();

//  ! method #end() cannot be accessed by the instance of Field - it is a private method
// gameField.#end(); // ❌
