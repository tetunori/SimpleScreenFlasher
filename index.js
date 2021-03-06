
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

const FLASH_CYCLE_TIME_MSEC_DEFAULT = 1100; // 1.1sec
let flashCycleTime_msec = FLASH_CYCLE_TIME_MSEC_DEFAULT;
const FLASH_FORCED_STOP_TIME_MSEC = 1000 * 60 * 4;  // 4 min

const KEYCODE_ESC   = 27;
const KEYCODE_X     = 88;
const KEYCODE_S     = 83;
const KEYCODE_LEFT  = 37;
const KEYCODE_UP    = 38;
const KEYCODE_RIGHT = 39;
const KEYCODE_DOWN  = 40;

// Handle key events.
window.addEventListener('keydown', (event) => {
    if ( ( event.keyCode === KEYCODE_X ) || ( event.keyCode === KEYCODE_ESC ) ) {
        opExit();
    }else if ( event.keyCode === KEYCODE_S ) {
        opStartStop();
    }else if ( event.keyCode === KEYCODE_LEFT ) {
        opColorA();
    }else if ( event.keyCode === KEYCODE_RIGHT ) {
        opColorB();
    }else if ( event.keyCode === KEYCODE_UP ) {
        opFastFlashInterval();
    }else if ( event.keyCode === KEYCODE_DOWN ) {
        opSlowFlashInterval();
    }
});

const addOnClickEventListnerMacro = ( id, func ) => {
    var obj = document.getElementById( id );
    obj.addEventListener( "click" , func , false );
}

// Key/Touch Operations
const opStartStop = () => {
    if( flashIntervalTimer === null ){
        goToFlashScreen();
    }else{
        stopFlashIntervalTimer();
    }
}
addOnClickEventListnerMacro( 'opStartStopText', opStartStop );

const opExit = () => {
    stopFlashAndGoToTitle();
}
addOnClickEventListnerMacro( 'opExit', opExit );

const opColorA = () => {
    goToFlashScreen();
    stopFlashIntervalTimer();
    changeFlashColor( 0 );
}
addOnClickEventListnerMacro( 'opColorA', opColorA );

const opColorB = () => {
    goToFlashScreen();
    stopFlashIntervalTimer();
    changeFlashColor( 1 );
}
addOnClickEventListnerMacro( 'opColorB', opColorB );

const opFastFlashInterval = () => {
    stopFlashIntervalTimer();
    makeFastFlashInterval();
    startFlashIntervalTimer();
}
addOnClickEventListnerMacro( 'opFastFlashInterval', opFastFlashInterval );

const opSlowFlashInterval = () => {
    stopFlashIntervalTimer();
    makeSlowFlashInterval();
    startFlashIntervalTimer();
}
addOnClickEventListnerMacro( 'opSlowFlashInterval', opSlowFlashInterval );

// Functions on mode transit
const stopFlashAndGoToTitle = () => {
    stopFlashIntervalTimer();
    clearFlashCanvas();
    transitToTitle();
    exitFullScreen();
}

const goToFlashScreen = () => {
    changeFlashColor();
    startFlashIntervalTimer();
    transitToFlash();
    requestFullScreen();
}

const setStyleDisplay = ( id, display ) => {
    document.getElementById( id ).style.display = display;
}

const transitToTitle = () => {
    setStyleDisplay("titleScreenWrapper", "block");
    setStyleDisplay("copyWriteText", "block");
    setStyleDisplay("operationText", "none");
    setStyleDisplay("exitButtonDiv", "none");
}

const transitToFlash = () => {
    setStyleDisplay("titleScreenWrapper", "none");
    setStyleDisplay("copyWriteText", "none");
    setStyleDisplay("operationText", "block");
    setStyleDisplay("exitButtonDiv", "block");
}

// Functions on flash canvas
let flashColor = ['', ''];
flashColor[0] = RED_COLOR;
flashColor[1] = GREEN_COLOR;

let flashIntervalTimer = null;
let flashForcedStopTimer = null;
const startFlashIntervalTimer = () => {
    if( flashForcedStopTimer === null ){
        flashForcedStopTimer = setTimeout( () => {
            stopFlashAndGoToTitle(); 
        }, FLASH_FORCED_STOP_TIME_MSEC );
    }

    if( flashIntervalTimer === null ){
        flashIntervalTimer = setInterval( () => {
            changeFlashColor();
        }, flashCycleTime_msec );
    }
}

const stopFlashIntervalTimer = () => {
    if( flashForcedStopTimer !== null ){
        clearTimeout( flashForcedStopTimer );
        flashForcedStopTimer = null;
    }

    if( flashIntervalTimer !== null ){
        clearInterval( flashIntervalTimer );
        flashIntervalTimer = null;
    }
}

const MAX_FLASHCYCLETIME_MSEC = 5000;
const MIN_FLASHCYCLETIME_MSEC = 300;
const makeFastFlashInterval = () => {
    if( flashCycleTime_msec > MIN_FLASHCYCLETIME_MSEC ){
        flashCycleTime_msec -= 50;
    }
    changeFlashIntervalText( flashCycleTime_msec );
    // console.log( `flashCycleTime_msec: ${flashCycleTime_msec}` );
}

const makeSlowFlashInterval = () => {
    if( flashCycleTime_msec < MAX_FLASHCYCLETIME_MSEC ){
        flashCycleTime_msec += 50;
    }
    changeFlashIntervalText( flashCycleTime_msec );
    // console.log( `flashCycleTime_msec: ${flashCycleTime_msec}` );
}

const changeFlashIntervalText = ( intervalTime ) => {
    let supplementaryText = ``;
    
    if( intervalTime === FLASH_CYCLE_TIME_MSEC_DEFAULT ){
        supplementaryText = `(default)`
    }else if( intervalTime === MAX_FLASHCYCLETIME_MSEC ){
        supplementaryText = `(slowest)`
    }else if( intervalTime === MIN_FLASHCYCLETIME_MSEC ){
        supplementaryText = `(fastest)`
    }

    document.getElementById("flashIntervalText").innerHTML = 
        `Flash Interval : ${intervalTime} msec${supplementaryText}`;
    
}

let currentColorIndex = 0; 
const changeFlashColor = ( index ) => {
    if( index === undefined ){
        // console.log( `currentColorIndex: ${currentColorIndex}` )
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

const setFlashCanvasColor = ( color ) => {
    let canvas = document.getElementById('flashCanvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
}

const clearFlashCanvas = () => {
    let canvas = document.getElementById('flashCanvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
}

// Animation start button
let startPointRadian = 0;
let currentBlur = 0;
const EASE = 0.07;
const BLUR_MAX = 8;

const drawAnimationStartButton = ( event ) => {
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
        x = 0;
        y = 0;
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
    let relAngle = Math.PI / 2 + Math.atan2( Y_CENTER - y, X_CENTER - x );
    startPointRadian += normalizeAngle( relAngle - startPointRadian ) * EASE;
    startPointRadian = normalizeAngle( startPointRadian );
    ctx.beginPath ();

    // RADIUS + 0.5 avoids noises on the circumference of the semi-circle
    ctx.arc( X_CENTER, Y_CENTER, RADIUS + 0.5, 
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

const normalizeAngle = ( angle ) => {
    let ret_val = angle;

    if( angle < - Math.PI ){
        ret_val = angle + 2 * Math.PI;
    }else if( angle > Math.PI ){
        ret_val = angle - 2 * Math.PI;
    }

    return ret_val;
}

const drawSettingMenu = ( event ) => {
    let canvas = document.getElementById('settingMenuCanvas');
    let ctx = canvas.getContext('2d');
    // ctx.fillStyle = "rgba(0,0,255,1.0)" ;
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const RADIUS = 0.9 * canvas.height / 2;
    const X_CENTER = 3 * canvas.width / 4;
    const Y_CENTER = canvas.height / 2;

    let x = 0; 
    let y = 0;
    if( event !== undefined ){
        let rect = event.target.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }

    // Color Wheel Base Circle
    let iteration = 0
    for( iteration = 0; iteration < RYB_WHEEL_COLOR_ARRAY.length; iteration++ ){
        ctx.beginPath();
        ctx.fillStyle = RYB_WHEEL_COLOR_ARRAY[ iteration ];
        ctx.moveTo( X_CENTER, Y_CENTER );
        ctx.arc( X_CENTER, Y_CENTER, RADIUS, iteration * Math.PI/6, ( iteration + 1 ) * Math.PI/6, false ) ;
        ctx.closePath();
        ctx.fill();
        // ctx.stroke();
    }

    // Hi-light selected color
    for( iteration = 0; iteration < RYB_WHEEL_COLOR_ARRAY.length; iteration++ ){
        if( ( RYB_WHEEL_COLOR_ARRAY[ iteration ] === flashColor[0] ) || 
                ( RYB_WHEEL_COLOR_ARRAY[ iteration ] === flashColor[1] ) ){
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(64, 64, 64)';
            ctx.moveTo( X_CENTER, Y_CENTER );
            ctx.arc( X_CENTER, Y_CENTER, RADIUS, iteration * Math.PI/6, ( iteration + 1 ) * Math.PI/6, false ) ;
            ctx.closePath();
            ctx.stroke();
        }
    }

    // More hi-light select target
    let distanceCenterToCursor = Math.hypot( x - X_CENTER, y - Y_CENTER );
    let relAngle = Math.atan2( Y_CENTER - y, X_CENTER - x );
    let selectTargetIndex = 0;
    for( iteration = 0; iteration < 6; iteration++ ){
        if( ( relAngle > iteration * Math.PI/6 ) && ( relAngle <= ( iteration + 1 ) * Math.PI/6 ) ){
            selectTargetIndex = 6 + iteration;
            break;
        }
        if( ( -relAngle > iteration * Math.PI/6 ) && ( -relAngle <= ( iteration + 1 ) * Math.PI/6 ) ){
            selectTargetIndex = 5 - iteration;
            break;
        }
    }

    if( distanceCenterToCursor < RADIUS ){
        // console.log( `${selectTargetIndex}` );
        for( iteration = 0; iteration < RYB_WHEEL_COLOR_ARRAY.length; iteration++ ){
            if( ( iteration === selectTargetIndex ) || 
                ( Math.abs( iteration - selectTargetIndex ) === 6 ) ){
                ctx.beginPath();
                ctx.strokeStyle = 'rgb(0, 0, 0)';
                ctx.moveTo( X_CENTER, Y_CENTER );
                ctx.arc( X_CENTER, Y_CENTER, RADIUS, iteration * Math.PI/6, ( iteration + 1 ) * Math.PI/6, false ) ;
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}

const selectFlashColorsFromSettingMenu = ( event ) => {

    let canvas = document.getElementById('settingMenuCanvas');
    let ctx = canvas.getContext('2d');

    const RADIUS = 0.9 * canvas.height / 2;
    const X_CENTER = 3 * canvas.width / 4;
    const Y_CENTER = canvas.height / 2;

    let x = 0; 
    let y = 0;
    if( event !== undefined ){
        let rect = event.target.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }

    let distanceCenterToCursor = Math.hypot( x - X_CENTER, y - Y_CENTER );
    let relAngle = Math.atan2( Y_CENTER - y, X_CENTER - x );
    let selectTargetIndex = 0;
    for( iteration = 0; iteration < 6; iteration++ ){
        if( ( relAngle > iteration * Math.PI/6 ) && ( relAngle <= ( iteration + 1 ) * Math.PI/6 ) ){
            selectTargetIndex = 6 + iteration;
            break;
        }
        if( ( -relAngle > iteration * Math.PI/6 ) && ( -relAngle <= ( iteration + 1 ) * Math.PI/6 ) ){
            selectTargetIndex = 5 - iteration;
            break;
        }
    }

    if( distanceCenterToCursor < RADIUS ){
        for( iteration = 0; iteration < RYB_WHEEL_COLOR_ARRAY.length; iteration++ ){
            if( iteration === selectTargetIndex ){
                flashColor[0] = RYB_WHEEL_COLOR_ARRAY[ selectTargetIndex ];
                if( iteration > 5 ){
                    flashColor[1] = RYB_WHEEL_COLOR_ARRAY[ selectTargetIndex - 6 ];
                }else{
                    flashColor[1] = RYB_WHEEL_COLOR_ARRAY[ selectTargetIndex + 6 ];
                }
                break;
            }
        }
    }

}

const drawExitButton = () => {
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

const drawHilightedExitButton = () => {
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

// https://liginc.co.jp/web/js/130758
(function() {
    let requestAnimationFrame = window.requestAnimationFrame || 
　　　　　　　　　　　　　　　　　　　window.mozRequestAnimationFrame ||
                            　window.webkitRequestAnimationFrame || 
　　　　　　　　　　　　　　　　　　　window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Mouse events.
let mousemoveEventStartButton = undefined;
let mousemoveEventSettingMenu = undefined;
const loop = () => {
    drawAnimationStartButton( mousemoveEventStartButton );
    drawSettingMenu( mousemoveEventSettingMenu );
    requestAnimationFrame( loop );
};
loop();

let startButtonCanvas = document.getElementById('startButtonCanvas');
startButtonCanvas.addEventListener('click', () => {
    // console.log( `startButtonCanvas.onClick` );
    goToFlashScreen();
}, false);
startButtonCanvas.addEventListener('mousemove', (event) => {
    mousemoveEventStartButton = event;
}, false);
startButtonCanvas.addEventListener('mouseout', () => {
    mousemoveEventStartButton = undefined;
}, false);

let settingMenuCanvas = document.getElementById('settingMenuCanvas');
settingMenuCanvas.addEventListener('click', (event) => {
    // console.log( `settingMenuCanvas.onClick` );
    selectFlashColorsFromSettingMenu( event );
}, false);
settingMenuCanvas.addEventListener('mousemove', (event) => {
    mousemoveEventSettingMenu = event;
}, false);
settingMenuCanvas.addEventListener('mouseout', () => {
    mousemoveEventSettingMenu = undefined;
}, false);

let exitButtonCanvas = document.getElementById('exitButtonCanvas');
exitButtonCanvas.addEventListener('click', () => {
    stopFlashAndGoToTitle();
}, false);
exitButtonCanvas.addEventListener('mouseover', () => {
    drawHilightedExitButton();
}, false);
exitButtonCanvas.addEventListener('mouseout', () => {
    drawExitButton();
}, false);
drawExitButton();

// Reference : https://stackoverflow.com/questions/36672561/how-to-exit-fullscreen-onclick-using-javascript
const requestFullScreen = () => {
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

const exitFullScreen = () => {
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

