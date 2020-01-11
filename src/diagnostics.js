let showDebug = true;

export const display = (ctx, size, p) => {
  if(!showDebug) return;

  const debugItems = [
    `Player position: ${p.x.toFixed(2)}, ${p.y.toFixed(2)}`,
    `Player velocity: ${p.xv.toFixed(2)}, ${p.yv.toFixed(2)}`,
    `Player jumping: ${Math.abs(p.yv) > 0}`,
  ];

  const padding = size * 2;
  ctx.fillStyle = '#fff';
  ctx.font = `${size}px monospace`;

  // Loop through debug items and display them with a 20 pixels gap in between.
  debugItems.forEach((e, i) => {
    ctx.fillText(e, padding, (size * 0.7) + padding + (i * size * 1.7));
  });
};