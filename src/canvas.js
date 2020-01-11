let canvas;

export const getDim = () => ({w: canvas.width, h: canvas.height});

export const init = drawFn => {
  canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize',  resizeCanvas);
  resizeCanvas();

  const refresh = () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, getDim().w, getDim().h);
  };

  const draw = () => {
    requestAnimationFrame(draw);

    refresh();

    drawFn(ctx);
  };

  draw();
};