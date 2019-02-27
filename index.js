const RED_COLOR   = 'rgb( 255,   0,   0)'; // #ff0000
const GREEN_COLOR = 'rgb(   0, 169,  51)'; // #00a933
const FLASH_CYCLE_TIME_MSEC = 1100;
const KEYCODE_ESC   = 27;
const KEYCODE_X     = 88;
const KEYCODE_S     = 83;
const KEYCODE_LEFT  = 37;
const KEYCODE_RIGHT = 39;

window.addEventListener('keydown', (event) => {
    if ( ( event.keyCode === KEYCODE_X ) || ( event.keyCode === KEYCODE_ESC ) ) {
        stopFlashIntervalTimer();
        clearFlashCanvas();
        transitToTitle();
        exitFullScreen();
    }else if ( event.keyCode === KEYCODE_S ) {
        if( flashIntervalTimer === null ){
            changeFlashColor();
            startFlashIntervalTimer();
            transitToFlash();
            requestFullScreen();
        }else{
            stopFlashIntervalTimer();
        }
    }else if ( event.keyCode === KEYCODE_LEFT ) {
        stopFlashIntervalTimer();
        changeFlashColor( 0 );
    }else if ( event.keyCode === KEYCODE_RIGHT ) {
        stopFlashIntervalTimer();
        changeFlashColor( 1 );
    }
});

let flashColor = ['', ''];
flashColor[0] = RED_COLOR;
flashColor[1] = GREEN_COLOR;
let currentColorIndex = 0; 

let flashIntervalTimer = null;
function startFlashIntervalTimer(){
    if( flashIntervalTimer === null ){
        flashIntervalTimer = setInterval( () => {
            changeFlashColor();
        }, FLASH_CYCLE_TIME_MSEC );
    }
}

function changeFlashColor( index ){
    if( index === undefined ){
        // console.log( 'currentColorIndex : ' + currentColorIndex )
        if( currentColorIndex === 0 ){
            setFlashCanvasColor( flashColor[1] );
            currentColorIndex = 1;
        }else{
            setFlashCanvasColor( flashColor[0] );
            currentColorIndex = 0;
        }
    }else{
        setFlashCanvasColor( flashColor[index] );
        currentColorIndex = index;
    }
}

function setFlashCanvasColor( color ){
    var canvas = document.getElementById('flashCanvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function stopFlashIntervalTimer(){
    if( flashIntervalTimer !== null ){
        clearInterval( flashIntervalTimer );
        flashIntervalTimer = null;
    }
}

function clearFlashCanvas(){
    var canvas = document.getElementById('flashCanvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || 
　　　　　　　　　　　　　　　　　　　window.mozRequestAnimationFrame ||
                            　window.webkitRequestAnimationFrame || 
　　　　　　　　　　　　　　　　　　　window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

let controlPosition = {x:0, y:0};
let currentBlur = 0;
const CONTROL_EASE = 0.07;
const BLUR_MAX = 8;

function drawAnimationStartButton( event ){
    var canvas = document.getElementById('startButtonCanvas');
    var ctx = canvas.getContext('2d');
    // ctx.fillStyle = "rgba(0,0,255,1.0)" ;
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const RADIUS = 0.9 * canvas.width / 2;
    const X_CENTER = canvas.width / 2;
    const Y_CENTER = canvas.height / 2;
    let x = 0; 
    let y = 0;
    if( event !== undefined ){
        let rect = event.target.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }

    // Base Circle
    ctx.beginPath();
    let distanceCenterToCursor = Math.hypot(x - X_CENTER, y - Y_CENTER);
    let targetBlur = 0;
    if( ( distanceCenterToCursor > RADIUS ) || ( event === undefined ) ){
        targetBlur = 0;
    }else{
        targetBlur = BLUR_MAX;
    }
    currentBlur += (targetBlur - currentBlur) * CONTROL_EASE;
    ctx.shadowBlur = currentBlur;
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.arc( X_CENTER, Y_CENTER, RADIUS, 
                0, 2 * Math.PI, false ) ;
    ctx.fillStyle = flashColor[0];
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2nd color semi-circle on base circle
    controlPosition.x += (x - controlPosition.x) * CONTROL_EASE;
    controlPosition.y += (y - controlPosition.y) * CONTROL_EASE;                    

    // For debug
    // ctx.fillStyle = 'rgb(0,0,0)';
    // ctx.fillRect(x, y, 10, 10);
    let startPointRadian = Math.PI / 2 + Math.atan2( Y_CENTER - controlPosition.y, X_CENTER - controlPosition.x );
    ctx.beginPath ();
    ctx.arc( X_CENTER, Y_CENTER, RADIUS, 
                startPointRadian, startPointRadian + Math.PI, false ) ;
    ctx.fillStyle = flashColor[1];
    ctx.fill();
    
    // Round Triangle
    ctx.beginPath();
    let unitLength = 25;
    ctx.moveTo( X_CENTER - unitLength/2, Y_CENTER - unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER + unitLength, Y_CENTER );
    ctx.lineTo( X_CENTER - unitLength/2, Y_CENTER + unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER - unitLength/2, Y_CENTER - unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER + unitLength, Y_CENTER );
    ctx.strokeStyle = 'rgb(245, 245, 245)';
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.fillStyle = 'rgb(245, 245, 245)' ;
    ctx.fill();
    
}

function drawExitButton(){
    var canvas = document.getElementById('exitButtonCanvas');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const X_CENTER = canvas.width / 2;
    const Y_CENTER = canvas.width / 2;

    // Round Triangle
    ctx.beginPath();
    let unitLength = 28;
    ctx.moveTo( X_CENTER + unitLength/2, Y_CENTER - unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER - unitLength, Y_CENTER );
    ctx.lineTo( X_CENTER + unitLength/2, Y_CENTER + unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER + unitLength/2, Y_CENTER - unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER - unitLength, Y_CENTER );
    ctx.strokeStyle = 'rgba(245, 245, 245, 0.4)';
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.stroke();                
}

function drawHilightedExitButton(){
    var canvas = document.getElementById('exitButtonCanvas');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const X_CENTER = canvas.width / 2;
    const Y_CENTER = canvas.width / 2;

   // Round Triangle
    ctx.beginPath();
    let unitLength = 28;
    ctx.moveTo( X_CENTER + unitLength/2, Y_CENTER - unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER - unitLength, Y_CENTER );
    ctx.lineTo( X_CENTER + unitLength/2, Y_CENTER + unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER + unitLength/2, Y_CENTER - unitLength*Math.sqrt(3)/2 );
    ctx.lineTo( X_CENTER - unitLength, Y_CENTER );
    ctx.strokeStyle = 'rgb(245, 245, 245)';
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.stroke();
    // ctx.fillStyle = 'rgb(245, 245, 245)' ;
    // ctx.fill();             
}

// Reference : https://stackoverflow.com/questions/36672561/how-to-exit-fullscreen-onclick-using-javascript
function requestFullScreen(){
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;
    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    }
}

function exitFullScreen(){
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;
    if (isInFullScreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}


let mousemoveEvent = undefined;
function loop(){
    drawAnimationStartButton( mousemoveEvent );
    requestAnimationFrame( loop );
};
loop();

let startButtonCanvas = document.getElementById('startButtonCanvas');
startButtonCanvas.addEventListener('click', () =>{
    // console.log( 'startButtonCanvas.onClick' );
    changeFlashColor();
    startFlashIntervalTimer();
    transitToFlash();
    requestFullScreen();
}, false);
startButtonCanvas.addEventListener('mousemove', (event) =>{
    mousemoveEvent = event;
}, false);
startButtonCanvas.addEventListener('mouseout', () =>{
    mousemoveEvent = undefined;
}, false);

let exitButtonCanvas = document.getElementById('exitButtonCanvas');
exitButtonCanvas.addEventListener('click', () =>{
    stopFlashIntervalTimer();
    clearFlashCanvas();
    transitToTitle();
    exitFullScreen();
}, false);
exitButtonCanvas.addEventListener('mouseover', () =>{
    drawHilightedExitButton();
}, false);
exitButtonCanvas.addEventListener('mouseout', () =>{
    drawExitButton();
}, false);
drawExitButton();

function transitToTitle(){
    document.getElementById("titleScreenWrapper").style.display="block";
    document.getElementById("copyWriteText").style.display="block";
    document.getElementById("operationText").style.display="none";
    document.getElementById("exitButtonDiv").style.display="none";
}

function transitToFlash(){
    document.getElementById("titleScreenWrapper").style.display="none";
    document.getElementById("copyWriteText").style.display="none";
    document.getElementById("operationText").style.display="block";
    document.getElementById("exitButtonDiv").style.display="block";
}

