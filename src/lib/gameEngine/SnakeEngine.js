/**
 * SnakeEngine - Classic snake game with fruit collection
 * Board is a grid where snake moves and eats fruits
 */
export class SnakeEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gridSize = width; // For square grid based on width

    this.fruitEmojis = ['🍎', '🥕', '🌽', '🍊', '🥬'];

    // Snake state: array of {x, y} segments, head is at index 0
    // Start with 2 segments
    const headX = Math.floor(width / 2);
    const headY = Math.floor(height / 2);
    this.snake = [
      { x: headX, y: headY },
      { x: headX - 1, y: headY }
    ];

    // Fruit position
    this.fruit = this.spawnFruit();

    // Current direction: { dx, dy }
    this.direction = { dx: 1, dy: 0 }; // Start moving right

    // Next direction (for input buffering)
    this.nextDirection = { dx: 1, dy: 0 };

    // Game state
    this.gameState = 'idle'; // idle, playing, lost
    this.score = 0;
    this.fruitsEaten = 0;
  }

  /**
   * Spawn fruit at random location not occupied by snake
   */
  spawnFruit() {
    let newFruit;
    let isValid = false;
    const emoji = this.fruitEmojis[Math.floor(Math.random() * this.fruitEmojis.length)];

    while (!isValid) {
      newFruit = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize),
        emoji,
      };

      // Check if fruit is not on snake
      isValid = !this.snake.some((segment) => segment.x === newFruit.x && segment.y === newFruit.y);
    }

    return newFruit;
  }

  /**
   * Set the next direction (prevents reversing into self)
   */
  setDirection(dx, dy) {
    // Prevent reversing 180 degrees
    const isReversal = dx === -this.direction.dx && dy === -this.direction.dy;
    if (!isReversal) {
      this.nextDirection = { dx, dy };
    }
  }

  /**
   * Update game state - move snake
   */
  update() {
    if (this.gameState !== 'playing') return;

    // Apply next direction
    this.direction = this.nextDirection;

    // Calculate new head position
    const head = this.snake[0];
    const newHead = {
      x: head.x + this.direction.dx,
      y: head.y + this.direction.dy,
    };

    console.log('UPDATE:', {
      gameState: this.gameState,
      gridSize: this.gridSize,
      head: { x: head.x, y: head.y },
      newHead,
      direction: this.direction,
      snake: this.snake.map(s => ({ x: s.x, y: s.y })),
    });

    // Check wall collision (no wrapping)
    if (newHead.x < 0 || newHead.x >= this.gridSize || newHead.y < 0 || newHead.y >= this.gridSize) {
      console.log('WALL COLLISION:', newHead, 'gridSize:', this.gridSize);
      this.gameState = 'lost';
      return;
    }

    // Check self collision
    if (this.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      this.gameState = 'lost';
      return;
    }

    // Add new head
    this.snake.unshift(newHead);

    // Check fruit collision
    if (newHead.x === this.fruit.x && newHead.y === this.fruit.y) {
      this.score += 10;
      this.fruitsEaten += 1;
      this.fruit = this.spawnFruit();
    } else {
      // Remove tail if no fruit eaten
      this.snake.pop();
    }
  }

  /**
   * Start the game
   */
  start() {
    this.gameState = 'playing';
  }

  /**
   * Get game state
   */
  getGameState() {
    return this.gameState;
  }

  /**
   * Get current score
   */
  getScore() {
    return this.score;
  }

  /**
   * Get snake segments
   */
  getSnake() {
    return [...this.snake];
  }

  /**
   * Get fruit position
   */
  getFruit() {
    return { ...this.fruit };
  }

  /**
   * Reset game
   */
  reset() {
    const headX = Math.floor(this.width / 2);
    const headY = Math.floor(this.height / 2);
    this.snake = [
      { x: headX, y: headY },
      { x: headX - 1, y: headY }
    ];
    this.fruit = this.spawnFruit();
    this.direction = { dx: 1, dy: 0 };
    this.nextDirection = { dx: 1, dy: 0 };
    this.gameState = 'idle';
    this.score = 0;
    this.fruitsEaten = 0;
  }
}
