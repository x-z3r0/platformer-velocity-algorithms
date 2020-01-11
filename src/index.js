const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize',  resizeCanvas);
resizeCanvas();

const circles = [];

const createCircle = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#65f061';
    ctx.stroke();
};

const getDist = (x1, y1, x2, y2) => {
    const xDiff = Math.abs(x1 - x2);
    const yDiff = Math.abs(y1 - y2);
    return Math.sqrt(xDiff ** 2 + yDiff ** 2 );
};

const getPos = () => {
    let xpos = 0;
    let ypos = 0;
    let correctPosFound = false;

    while(!correctPosFound){
        xpos = Math.floor(Math.random() * canvas.width) + 1;
        ypos = Math.floor(Math.random() * canvas.height) + 1;

        let isOutsideCircles = true;
        for(let i = 0; i < circles.length; i++){
            const c = circles[i];
            const dist = getDist(xpos, ypos, c.cx, c.cy);
            if(dist <= c.radius){
                isOutsideCircles = false;
                break;
            }
        }

        correctPosFound = isOutsideCircles;
    }

    return {cx: xpos, cy: ypos};
};

const touchingEdge = (cx, cy, r) => {
    return cx -  r <= 0 ||
           cx +  r >= canvas.width ||
           cy -  r <= 0 ||
           cy +  r >= canvas.height;
};

const touchingOtherCircle = (cx, cy, r) => {
    for(let i = 0; i < circles.length; i++){
        const c2 = circles[i];
        if(c2.cx === cx && c2.cy === cy) { //must be same circle
            continue;
        }
        const distance = getDist(c2.cx, c2.cy, cx, cy);
        if(distance < c2.radius + r){
            return true;
        }
    }

    return false;
};

const circle = () => {
    let radius = 0;
    let xyPos = getPos();
    let cx = xyPos.cx;
    let cy =  xyPos.cy;
    let canGrow = true;
    return {
        get cx() { return cx; },
        get cy() { return cy; },
        get radius() { return radius; },
        drawCircle(){
            if(canGrow) {
                if(touchingEdge(cx, cy, radius) || touchingOtherCircle(cx, cy, radius)) {
                    canGrow = false;
                } else {
                    radius++;
                }
            }
            createCircle( cx,  cy,  radius);
        }
    }
};

const draw = () => {
  requestAnimationFrame(draw);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.push(new circle());

  circles.forEach(c => c.drawCircle());
};


draw();