export const keysDown = new Set();

document.addEventListener('keydown', event => {
  keysDown.add(event.key);
});

document.addEventListener('keyup', event => {
  if(keysDown.has(event.key)) keysDown.delete(event.key);
});