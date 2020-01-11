import * as canvas from './canvas';
import {keysDown} from './keyMonitor';
import * as diagnostics from './diagnostics';

const player = {
  x: 0,
  y: 0,
  // Horizontal velocity.
  xv: 0,
  // Vertical velocity.
  yv: 0,
  // Maximum horizontal velocity.
  xvMax: 10,
  // Time to accelerate to maximum velocity in frames.
  xvMaxTime: 30,
  // Will set velocity to maximum once threshold is reached.
  xvRoundThreshold: 0.90,
  jumpHeight: 100,
  // Time to reach the apex of the jump in frames.
  jumpHeightTime: 15,
  // Dimensions of the hitbox.
  width: 75,
  height: 75,
};

// Y position of the ground.
const groundLevel = player.height / -2;

const handlePhysics = p => {
  // Calculate friction multiplier based on the time to accelerate to maximum velocity.
  const frictionMultiplier = 1 - ((Math.log(1 - p.xvRoundThreshold) * -1) / p.xvMaxTime);
  // Calculate gravity based on the jump height and time to reach the apex of the jump.
  const gravity = (p.jumpHeight * 2) / (p.jumpHeightTime ** 2);

  // Apply force based on the maximum horizontal velocity and time to accelerate.
  // If player presses right...
  if(keysDown.has('d'))
    p.xv += (p.xvMax / frictionMultiplier) - p.xvMax;
  // If player presses left...
  if(keysDown.has('a'))
    p.xv -= (p.xvMax / frictionMultiplier) - p.xvMax;

  // If player jumps and is on the ground calculate the initial velocity to
  // reach the jump height.
  if(keysDown.has('w') && p.y === groundLevel + player.height / 2)
    p.yv = (p.jumpHeight * 2) / p.jumpHeightTime;

  // Multiply the player's horizontal velocity by the friction multiplier to
  // apply friction.
  p.xv *= frictionMultiplier;
  // Apply gravity to the player by reducing the player's vertical velocity
  // every frame.
  // Only half of the gravity is subtracted on the first frame to avoid an
  // inefficient Euler integration.
  p.yv -= gravity / 2;

  // Horizontal velocity is set to the player's maximum horizontal velocity
  // when reaching a threshold.
  if(keysDown.has('d') && p.xvMax - p.xv < (1 - p.xvRoundThreshold))
    p.xv = p.xvMax;
  if(keysDown.has('a') && p.xvMax + p.xv < (1 - p.xvRoundThreshold))
    p.xv = p.xvMax * -1;

  // If the player is decelerating and has reached the threshold,
  // set the horizontal velocity to 0.
  if(Math.abs(p.xv) < (1 - p.xvRoundThreshold) && !keysDown.has('d') && !keysDown.has('a'))
    p.xv = 0;

  // Once the player's velocity has been calculated, add the velocity to
  // the player's position.
  p.x += p.xv;
  p.y += p.yv;

  // Subtract the second half of the gravity after it has been applied to
  // the position to be added on the next frame.
  p.yv -= gravity / 2;

  // Check if player is below the ground and if so then set the
  // player's y position to ground level.
  if (p.y < groundLevel + player.height / 2) {
    p.y = groundLevel + player.height / 2;
    p.yv = 0;
  }

  // Check if player is outside borders and if so then set the
  // player's x position to the border position.
  if(Math.abs(p.x) > (canvas.getDim().w / 2) - (p.width / 2)) {
    p.x = Math.sign(p.x) * ((canvas.getDim().w / 2) - (p.width / 2));
    p.xv = 0;
  }
};

const drawPlayer = (ctx, p) => {
  // Draws with cartesian coordinates and centers rectangle.
  const drawX = (p.x - (p.width / 2)) + (canvas.getDim().w / 2);
  const drawY = ((p.y * -1) - (p.height / 2)) + (canvas.getDim().h / 2);

  ctx.fillStyle = '#fff';
  ctx.fillRect(drawX, drawY, p.width, p.height);
};

canvas.init(ctx => {
  handlePhysics(player);

  drawPlayer(ctx, player);

  diagnostics.display(ctx, 21, player);
});