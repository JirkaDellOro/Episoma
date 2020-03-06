"use strict";
var Episoma;
(function (Episoma) {
    Episoma.ƒ = FudgeCore;
    // ƒ.RenderManager.initialize(true, true);
    let GAME_STATE;
    (function (GAME_STATE) {
        GAME_STATE[GAME_STATE["START"] = 0] = "START";
        GAME_STATE[GAME_STATE["MENU"] = 1] = "MENU";
        GAME_STATE[GAME_STATE["PLAY"] = 2] = "PLAY";
        GAME_STATE[GAME_STATE["OVER"] = 3] = "OVER";
    })(GAME_STATE || (GAME_STATE = {}));
    // window.addEventListener("load", hndLoad);
    document.addEventListener("click", hndLoad);
    Episoma.game = new Episoma.ƒ.Node("FudgeCraft");
    Episoma.grid = new Episoma.Grid();
    let state = GAME_STATE.START;
    let controlActive;
    // let controls: Control[] = [];
    let viewport;
    let speedCameraRotation = 0.2;
    let speedCameraTranslation = 0.02;
    async function hndLoad(_event) {
        document.removeEventListener("click", hndLoad);
        const canvas = document.querySelector("canvas");
        Episoma.args = new URLSearchParams(location.search);
        Episoma.ƒ.Debug.log("Canvas", canvas);
        Episoma.Audio.start();
        // enable unlimited mouse-movement (user needs to click on canvas first)
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", () => document.exitPointerLock());
        canvas.addEventListener("click", handleClick);
        // set lights
        let cmpLight = new Episoma.ƒ.ComponentLight(new Episoma.ƒ.LightDirectional(Episoma.ƒ.Color.CSS("WHITE")));
        cmpLight.pivot.lookAt(new Episoma.ƒ.Vector3(0.5, -1, -0.8));
        let cmpLightAmbient = new Episoma.ƒ.ComponentLight(new Episoma.ƒ.LightAmbient(new Episoma.ƒ.Color(0.25, 0.25, 0.25, 1)));
        Episoma.game.addComponent(cmpLightAmbient);
        // setup orbiting camera
        Episoma.camera = new Episoma.CameraOrbit(75);
        Episoma.game.appendChild(Episoma.camera);
        Episoma.camera.setRotationX(-20);
        Episoma.camera.setRotationY(20);
        Episoma.camera.cmpCamera.getContainer().addComponent(cmpLight);
        // setup viewport
        viewport = new Episoma.ƒ.Viewport();
        viewport.initialize("Viewport", Episoma.game, Episoma.camera.cmpCamera, canvas);
        Episoma.ƒ.Debug.log("Viewport", viewport);
        // points = new Points(viewport, document.querySelector("#Score"), document.querySelector("div#Calculation"));
        // setup event handling
        viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        viewport.activateWheelEvent("\u0192wheel" /* WHEEL */, true);
        viewport.addEventListener("\u0192pointermove" /* MOVE */, hndPointerMove);
        viewport.addEventListener("\u0192wheel" /* WHEEL */, hndWheelMove);
        start();
        controlActive = Episoma.body.controls[0];
        updateDisplay();
        Episoma.ƒ.Debug.log("Game", Episoma.game);
    }
    function setState(_new) {
        state = _new;
        Episoma.ƒ.Debug.log("State", state);
    }
    async function start() {
        setState(GAME_STATE.MENU);
        Episoma.body = new Episoma.Body(Episoma.bodyData["Cube"]);
        Episoma.ƒ.Debug.log("Wait for space");
        await waitForKeyPress(Episoma.ƒ.KEYBOARD_CODE.SPACE);
        Episoma.ƒ.Debug.log("Space pressed");
        Episoma.body.explode();
        Episoma.Audio.play(Episoma.AUDIO.START, false);
        Episoma.Audio.play(Episoma.AUDIO.PLAY);
        Episoma.Audio.play(Episoma.AUDIO.CRASH);
        let domMenu = document.querySelector("div#Menu");
        domMenu.style.visibility = "hidden";
        window.addEventListener("keydown", hndKeyDown); // activate when user starts...
        startCountDown();
        setState(GAME_STATE.PLAY);
    }
    function end() {
        let domOver = document.querySelector("div#Over");
        domOver.style.visibility = "visible";
        window.removeEventListener("keydown", hndKeyDown); // activate when user starts...
        setState(GAME_STATE.OVER);
    }
    async function waitForKeyPress(_code) {
        return new Promise(_resolve => {
            window.addEventListener("keydown", hndKeyDown);
            function hndKeyDown(_event) {
                if (_event.code == _code) {
                    window.removeEventListener("keydown", hndKeyDown);
                    _resolve();
                }
            }
        });
    }
    function startCountDown() {
        let countDown = new Episoma.ƒ.Time();
        countDown.setTimer(1000, 0, showCountDown);
        function showCountDown(_event) {
            let time = 3 * 60 * 1000 - countDown.get();
            displayTime(time);
            if (time < 0) {
                countDown.clearAllTimers();
                displayTime(0);
                end();
            }
        }
    }
    function displayTime(_time) {
        let units = Episoma.ƒ.Time.getUnits(_time);
        let domTime = document.querySelector("h1#Time");
        domTime.textContent = units.minutes.toString().padStart(2, "0") + ":" + units.seconds.toString().padStart(2, "0");
    }
    function updateDisplay() {
        viewport.draw();
    }
    Episoma.updateDisplay = updateDisplay;
    //#region Interaction
    function handleClick(_event) {
        if (Episoma.ƒ.Time.game.hasTimers())
            return;
        let mouse = new Episoma.ƒ.Vector2(_event.offsetX, _event.offsetY);
        let pickResults = [];
        for (let control of Episoma.body.controls)
            pickResults.push({ distance: control.pickFragment(viewport, mouse), control: control });
        pickResults.sort((_a, _b) => _a.distance < _b.distance || !_b.distance ? -1 : 1);
        Episoma.ƒ.Debug.log(pickResults);
        if (pickResults[0]) {
            controlActive.freezeFragment();
            controlActive = pickResults[0].control;
            controlActive.unfreezeFragment();
        }
        controlActive.rotateToSegment(Episoma.camera.getSegmentY());
    }
    function hndPointerMove(_event) {
        if (!_event.buttons)
            return;
        Episoma.camera.rotateY(_event.movementX * speedCameraRotation);
        Episoma.camera.rotateX(_event.movementY * speedCameraRotation);
        if (!Episoma.ƒ.Time.game.hasTimers())
            controlActive.rotateToSegment(Episoma.camera.getSegmentY());
        updateDisplay();
    }
    function hndWheelMove(_event) {
        Episoma.camera.translate(_event.deltaY * speedCameraTranslation);
        updateDisplay();
    }
    function hndKeyDown(_event) {
        if (Episoma.ƒ.Time.game.hasTimers())
            return;
        let code = (_event.shiftKey ? Episoma.ƒ.KEYBOARD_CODE.SHIFT_LEFT : "") + _event.code;
        let transformation = Episoma.Control.transformations[code];
        if (!transformation)
            return;
        controlActive.moveTo(transformation);
        updateDisplay();
    }
    //#endregion
    // function callToAction(_message: string): void {
    //   let span: HTMLElement = document.querySelector("span#CallToAction");
    //   span.textContent = _message;
    //   span.style.animation = "none";
    //   isNaN(span.offsetHeight); // stupid hack to restart css-animation, read offsetHeight
    //   span.style.animation = null;
    // }
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Main.js.map