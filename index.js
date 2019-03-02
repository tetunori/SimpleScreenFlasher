
// Global Constants
const RED_ORANGE_COLOR    = 'rgb( 255,  64,   0)'; // #ff4000
const RED_COLOR           = 'rgb( 255,   0,   0)'; // #ff0000
const RED_VIOLET_COLOR    = 'rgb( 191,   0,  65)'; // #bf0041
const VIOLET_COLOR        = 'rgb( 128,   0, 128)'; // #800080
const BLUE_VIOLET_COLOR   = 'rgb(  85,  48, 141)'; // #55308d
const BLUE_COLOR          = 'rgb(  42,  96, 153)'; // #2a6099
const BLUE_GREEN_COLOR    = 'rgb(  21, 132, 102)'; // #158466
const GREEN_COLOR         = 'rgb(   0, 169,  51)'; // #00a933
const YELLOW_GREEN_COLOR  = 'rgb( 129, 212,  26)'; // #81d41a
const YELLOW_COLOR        = 'rgb( 255, 255,   0)'; // #ffff00
const YELLOW_ORANGE_COLOR = 'rgb( 255, 191,   0)'; // #ffbf00
const ORANGE_COLOR        = 'rgb( 255, 128,   0)'; // #ff8000
const RYB_WHEEL_COLOR_ARRAY = [ RED_ORANGE_COLOR, RED_COLOR, RED_VIOLET_COLOR, VIOLET_COLOR, 
                                    BLUE_VIOLET_COLOR, BLUE_COLOR, BLUE_GREEN_COLOR, GREEN_COLOR, 
                                        YELLOW_GREEN_COLOR, YELLOW_COLOR, YELLOW_ORANGE_COLOR, ORANGE_COLOR ];

const FLASH_CYCLE_TIME_MSEC = 1100; // 1.1sec
const FLASH_FORCED_STOP_TIME_MSEC = 1000 * 60 * 4;  // 4 min

const KEYCODE_ESC   = 27;
const KEYCODE_X     = 88;
const KEYCODE_S     = 83;
const KEYCODE_LEFT  = 37;
const KEYCODE_RIGHT = 39;

// Handle key events.
window.addEventListener('keydown', (event) => {
    if ( ( event.keyCode === KEYCODE_X ) || ( event.keyCode === KEYCODE_ESC ) ) {
        stopFlashAndGoToTitle();
    }else if ( event.keyCode === KEYCODE_S ) {
        if( flashIntervalTimer === null ){
            goToFlashScreen();
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

// Functions on mode transit
function stopFlashAndGoToTitle(){
    stopFlashIntervalTimer();
    clearFlashCanvas();
    transitToTitle();
    exitFullScreen();
}

function goToFlashScreen(){
    changeFlashColor();
    startFlashIntervalTimer();
    transitToFlash();
    requestFullScreen();
}

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

// Functions on flash canvas
let flashColor = ['', ''];
flashColor[0] = RED_COLOR;
flashColor[1] = GREEN_COLOR;

let flashIntervalTimer = null;
let flashForcedStopTimer = null;
function startFlashIntervalTimer(){
    if( flashForcedStopTimer === null ){
        flashForcedStopTimer = setTimeout( () => {
            stopFlashAndGoToTitle(); 
        }, FLASH_FORCED_STOP_TIME_MSEC );
    }

    if( flashIntervalTimer === null ){
        flashIntervalTimer = setInterval( () => {
            changeFlashColor();
        }, FLASH_CYCLE_TIME_MSEC );
    }
}

function stopFlashIntervalTimer(){
    if( flashForcedStopTimer !== null ){
        clearTimeout( flashForcedStopTimer );
        flashForcedStopTimer = null;
    }

    if( flashIntervalTimer !== null ){
        clearInterval( flashIntervalTimer );
        flashIntervalTimer = null;
    }
}

let currentColorIndex = 0; 
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
    let canvas = document.getElementById('flashCanvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
}

function clearFlashCanvas(){
    let canvas = document.getElementById('flashCanvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
}

// Animation start button
// https://liginc.co.jp/web/js/130758
(function() {
    let requestAnimationFrame = window.requestAnimationFrame || 
　　　　　　　　　　　　　　　　　　　window.mozRequestAnimationFrame ||
                            　window.webkitRequestAnimationFrame || 
　　　　　　　　　　　　　　　　　　　window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

let controlPosition = {x:0, y:0};
let currentBlur = 0;
const EASE = 0.07;
const BLUR_MAX = 8;

function drawAnimationStartButton( event ){
    let canvas = document.getElementById('startButtonCanvas');
    let ctx = canvas.getContext('2d');
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
    let distanceCenterToCursor = Math.hypot( x - X_CENTER, y - Y_CENTER );
    let targetBlur = 0;
    if( ( distanceCenterToCursor > RADIUS ) || ( event === undefined ) ){
        targetBlur = 0;
    }else{
        targetBlur = BLUR_MAX;
    }
    currentBlur += ( targetBlur - currentBlur ) * EASE;
    ctx.shadowBlur = currentBlur;
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.arc( X_CENTER, Y_CENTER, RADIUS, 0, 2 * Math.PI, false ) ;
    ctx.fillStyle = flashColor[0];
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2nd color semi-circle on base circle
    controlPosition.x += ( x - controlPosition.x ) * EASE;
    controlPosition.y += ( y - controlPosition.y ) * EASE;

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

function drawSettingMenu( event ){
    let canvas = document.getElementById('settingMenuCanvas');
    let ctx = canvas.getContext('2d');
    // ctx.fillStyle = "rgba(0,0,255,1.0)" ;
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const RADIUS = 0.9 * canvas.height / 2;
    const X_CENTER = 3 * canvas.width / 4;
    const Y_CENTER = canvas.height / 2;

    // Color Wheel Base Circle
    for( let iteration = 0; iteration < RYB_WHEEL_COLOR_ARRAY.length; iteration++ ){
        ctx.beginPath();
        ctx.fillStyle = RYB_WHEEL_COLOR_ARRAY[ iteration ];
        ctx.moveTo( X_CENTER, Y_CENTER );
        ctx.arc( X_CENTER, Y_CENTER, RADIUS, iteration * Math.PI/6, ( iteration + 1 ) * Math.PI/6, false ) ;
        ctx.closePath();
        ctx.fill();
        // ctx.stroke();
    }

}

function drawExitButton(){
    let canvas = document.getElementById('exitButtonCanvas');
    let ctx = canvas.getContext('2d');

    ctx.clearRect( 0, 0, canvas.width, canvas.height );

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
    let canvas = document.getElementById('exitButtonCanvas');
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const X_CENTER = canvas.width / 2;
    const Y_CENTER = canvas.width / 2;

    // Circle
    ctx.beginPath();
    const RADIUS = 0.9 * canvas.width / 2;
    ctx.arc( X_CENTER, Y_CENTER, RADIUS, 0, 2 * Math.PI, false ) ;
    ctx.fillStyle = 'rgba( 255, 255, 255, 0.2)';
    ctx.fill();

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
    
}

// Mouse events.
let mousemoveEvent = undefined;
function loop(){
    drawAnimationStartButton( mousemoveEvent );
    drawSettingMenu( mousemoveEvent );
    requestAnimationFrame( loop );
};
loop();

let startButtonCanvas = document.getElementById('startButtonCanvas');
startButtonCanvas.addEventListener('click', () =>{
    // console.log( 'startButtonCanvas.onClick' );
    goToFlashScreen();
}, false);
startButtonCanvas.addEventListener('mousemove', (event) =>{
    mousemoveEvent = event;
}, false);
startButtonCanvas.addEventListener('mouseout', () =>{
    mousemoveEvent = undefined;
}, false);

let exitButtonCanvas = document.getElementById('exitButtonCanvas');
exitButtonCanvas.addEventListener('click', () =>{
    stopFlashAndGoToTitle();
}, false);
exitButtonCanvas.addEventListener('mouseover', () =>{
    drawHilightedExitButton();
}, false);
exitButtonCanvas.addEventListener('mouseout', () =>{
    drawExitButton();
}, false);
drawExitButton();

// Reference : https://stackoverflow.com/questions/36672561/how-to-exit-fullscreen-onclick-using-javascript
function requestFullScreen(){
    let isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    let docElm = document.documentElement;
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
    let isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

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

