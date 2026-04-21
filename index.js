import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true }); // * Initializing the prompt-sync module to allow for user input in the terminal, with the option to handle SIGINT (Ctrl+C) gracefully.

// * Game elements/assets constants
const HAT = "^";
const HOLE = "O";
const GRASS = "░";
const PLAYER = "*";


// * UP / DOWN / LEFT / RIGHT / QUIT keyboard constants
const UP = "W";
const DOWN = "S";
const LEFT = "A";
const RIGHT = "D";
const QUIT = "Q";


// *MSG_UP / MSG_DOWN / MSG_LEFT / MSG_RIGHT / MSG_ QUIT / MSG_INVALID message constants
const FEEDBACK_UP = "You moved up!";
const FEEDBACK_DOWN = "You moved down!";
const FEEDBACK_LEFT = "You moved left!";
const FEEDBACK_RIGHT = "You moved right!";
const FEEDBACK_QUIT = "You have quit the game!";
const FEEDBACK_INVALID = "Invalid entry!";


// *WIN / LOSE / OUT / SAFE / QUIT messages constants
const FEEDBACK_WIN_MSG = "Congratulations! You won!";
const FEEDBACK_LOSE_MSG = "You fell into a hole. Game Over!";
const FEEDBACK_OUT_MSG = "You stepped out of the platform. Game Over!";
const FEEDBACK_SAFE_MSG = "You moved to a safe spot.";
const FEEDBACK_QUIT_MSG = "You have quit the game. Thank you for playing.";


// *MAP ROWS, COLUMNS AND PERCENTAGE
const ROWS = 8;
const COLS = 5;
const PERCENT = 0.2; /* Percentage on the number of holes in the game map*/


// * Field class to create the game field and implement the game logic
class Field {
  // * constructor, a built-in method of a class (invoked when an object of a class is instantiated)
  constructor(field = [[]]) {
    this.field = field;
    this.gamePlay = false;
  }


  // * generateField is a static method, returning a 2D array of the fields
  static generateField(rows, columns, percentage) {

    const map = [[]];

    for (let i = 0; i < rows; i++) {
      map[i] = []; // generate the row  for the map

      for (let j = 0; j < columns; j++) {
        map[i][j] = Math.random() < PERCENT ? HOLE : GRASS; // ~80% GRASS, ~20% HOLES
      }

    }

    return map; // return the generated 2D array
  }


  // * welcomeMessage is a static method, displays a string
  static welcomeMsg(Msg) {
    console.log(Msg);
  }


  // * setHat positions the hat along a random x and y position within field array
  setHat() {
    
    const x = Math.floor(Math.random() * (ROWS - 1) + 1); // establish a random position of X in the field
    
    const y = Math.floor(Math.random() * (COLS - 1) + 1); // establish a random position of Y in the field
    
    this.field[x][y] = HAT; // set the HAT along the derived random position this.field[x][y]

  }

  // * printField displays the updated status of the field position
  printField() {

    this.field.forEach(row => console.log(row.join(" "))); // forEach method to iterate through each row of the field, and join method to display the elements of the row as a string with spaces in between

  }

  // TODO: updateMove displays the move (key) entered by the user
  updateMove(direction) {
    console.log(direction);
  }


  // * updateGame Assessment Challenge
  updateGame() {

    // Check if the player moved out of the map
    if (this.playerRow < 0 || this.playerRow >= ROWS || this.playerCol < 0 || this.playerCol >= COLS) {
      console.log(FEEDBACK_OUT_MSG);
      this.#end();
    }

    // Check the tile the player moved to
    const currentTile = this.field[this.playerRow][this.playerCol];
    switch (currentTile) {

      // If player moves falls into the HOLE, player loses the game. Pring the lose message and end the game.
      case HOLE:
        console.log(FEEDBACK_LOSE_MSG);
        this.#end();
        break;

      // If player moves to another GRASS spot, player continues with the game. Print the feedback message and update the player's position on the map.
      case GRASS:
        console.log(FEEDBACK_SAFE_MSG);
        break;

      // If player moves to the HAT, player wins the game. Print the win message and end the game.
      case HAT:
        console.log(FEEDBACK_WIN_MSG);
        this.#end();
        break;

      // If player moves to an unknown tile type, print the unknown tile type message and end the game.  
      default:
        console.log("Unknown tile type!");
        break;
    }

    // Update the player's position on the map
    this.field[this.playerRow][this.playerCol] = PLAYER;

    // Print the updated field after the player's move
    this.printField();
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

    // Print the initial field
    this.printField();

    while (this.gamePlay) {
      
      const input = prompt("What is your move? W(up), A(left), S(down), D(right) to move, Q to quit: ").toUpperCase();
      
      let flagInvalid = false;     

      let feedback = "";

      switch (input) {
        
        case UP:
          if (this.playerRow > 0) {
            this.playerRow--;
            feedback = FEEDBACK_UP;
          } else {
            console.log(FEEDBACK_OUT_MSG);
            this.#end();
          }
          break;

        case DOWN:
          if (this.playerRow < ROWS - 1) {
            this.playerRow++;
            feedback = FEEDBACK_DOWN;
          } else {
            console.log(FEEDBACK_OUT_MSG);
            this.#end();
          }
          break;

        case LEFT:
          if (this.playerCol > 0) {
            this.playerCol--;
            feedback = FEEDBACK_LEFT;
          } else {
            console.log(FEEDBACK_OUT_MSG);
            this.#end();
          }
          break;

        case RIGHT:
          if (this.playerCol < COLS - 1) {
            this.playerCol++;
            feedback = FEEDBACK_RIGHT;
          } else {
            console.log(FEEDBACK_OUT_MSG);
            this.#end();
          }
          break;

        case QUIT:
          console.log(FEEDBACK_QUIT_MSG);
          this.#end();
          break;

        default:
          feedback = FEEDBACK_INVALID;
          flagInvalid = true;
          break;
          
      }

      this.updateMove(feedback);

      if (!flagInvalid) {

        // Check the game state
        this.updateGame();

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

// *Generate a welcome message
Field.welcomeMsg("\n************WELCOME TO FIND YOUR HAT************\n");

// * Create a new instance of the game
// * by passing createField as a parameter to the new instance of Field
const gameField = new Field(createField);

// * Invoke method start(...) from the instance of game object
gameField.start();

//  ! method #end() cannot be accessed by the instance of Field - it is a private method
// gameField.#end(); // ❌
