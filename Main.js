"use strict";
var Episoma;
(function (Episoma) {
    Episoma.ƒ = FudgeCore;
    let GAME_STATE;
    (function (GAME_STATE) {
        GAME_STATE[GAME_STATE["START"] = 0] = "START";
        GAME_STATE[GAME_STATE["MENU"] = 1] = "MENU";
        GAME_STATE[GAME_STATE["PLAY"] = 2] = "PLAY";
        GAME_STATE[GAME_STATE["OVER"] = 3] = "OVER";
    })(GAME_STATE || (GAME_STATE = {}));
    window.addEventListener("load", hndLoad);
    Episoma.game = new Episoma.ƒ.Node("FudgeCraft");
    Episoma.grid = new Episoma.Grid();
    let state = GAME_STATE.START;
    let controlActive;
    let controls = [];
    let viewport;
    let speedCameraRotation = 0.2;
    let speedCameraTranslation = 0.02;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        Episoma.args = new URLSearchParams(location.search);
        Episoma.ƒ.RenderManager.initialize(true, true);
        Episoma.ƒ.Debug.log("Canvas", canvas);
        // enable unlimited mouse-movement (user needs to click on canvas first)
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", () => document.exitPointerLock());
        canvas.addEventListener("click", handleClick);
        // set lights
        let cmpLight = new Episoma.ƒ.ComponentLight(new Episoma.ƒ.LightDirectional(Episoma.ƒ.Color.CSS("WHITE")));
        cmpLight.pivot.lookAt(new Episoma.ƒ.Vector3(0.5, 1, 0.8));
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
        Episoma.points = new Episoma.Points(viewport, document.querySelector("#Score"), document.querySelector("div#Calculation"));
        // setup event handling
        viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        viewport.activateWheelEvent("\u0192wheel" /* WHEEL */, true);
        viewport.addEventListener("\u0192pointermove" /* MOVE */, hndPointerMove);
        viewport.addEventListener("\u0192wheel" /* WHEEL */, hndWheelMove);
        start();
        controlActive = controls[0];
        updateDisplay();
        Episoma.ƒ.Debug.log("Game", Episoma.game);
    }
    function setState(_new) {
        state = _new;
        Episoma.ƒ.Debug.log("State", state);
    }
    async function start() {
        setState(GAME_STATE.MENU);
        // grid.push(ƒ.Vector3.ZERO(), new GridElement(new Cube(CUBE_TYPE.BLACK, ƒ.Vector3.ZERO())), true);
        setCenterFragment();
        for (let i = 0; i < 4; i++)
            startRandomFragment();
        Episoma.ƒ.Debug.log("Wait for space");
        await waitForKeyPress(Episoma.ƒ.KEYBOARD_CODE.SPACE);
        Episoma.ƒ.Debug.log("Space pressed");
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
        let mouse = new Episoma.ƒ.Vector2(_event.offsetX, _event.offsetY);
        for (let control of controls)
            if (control.pickFragment(viewport, mouse)) {
                controlActive.freezeFragment();
                controlActive = control;
                controlActive.unfreezeFragment();
            }
        controlActive.rotateToSegment(Episoma.camera.getSegmentY());
    }
    function hndPointerMove(_event) {
        if (!document.pointerLockElement)
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
        if (transformation)
            move(transformation);
        updateDisplay();
    }
    //#endregion
    //#region Start/Drop Fragments
    function setCenterFragment() {
        let fragment = Episoma.Fragment.getRandom();
        let control = new Episoma.Control();
        control.setFragment(fragment);
        Episoma.game.appendChild(control);
        control.freezeFragment(true);
    }
    Episoma.setCenterFragment = setCenterFragment;
    function startRandomFragment() {
        let fragment = Episoma.Fragment.getRandom();
        let cardinals = Array.from(Episoma.Grid.cardinals);
        let control = new Episoma.Control();
        control.cmpTransform.local.translation = Episoma.ƒ.Vector3.ZERO();
        control.setFragment(fragment);
        Episoma.game.appendChild(control);
        let start;
        try {
            do {
                let index = Episoma.ƒ.random.getIndex(cardinals);
                let offset = cardinals.splice(index, 1)[0];
                start = { translation: Episoma.ƒ.Vector3.SCALE(offset, 5), rotation: Episoma.ƒ.Vector3.ZERO() };
            } while (control.checkCollisions(start).length > 0);
        }
        catch (_error) {
            callToAction("GAME OVER");
        }
        control.move(start);
        control.freezeFragment();
        controls.push(control);
    }
    Episoma.startRandomFragment = startRandomFragment;
    //#endregion
    function move(_transformation) {
        let animationSteps = 5;
        let fullRotation = 90;
        let fullTranslation = 1;
        let move = {
            rotation: _transformation.rotation ? Episoma.ƒ.Vector3.SCALE(_transformation.rotation, fullRotation) : new Episoma.ƒ.Vector3(),
            translation: _transformation.translation ? Episoma.ƒ.Vector3.SCALE(_transformation.translation, fullTranslation) : new Episoma.ƒ.Vector3()
        };
        if (controlActive.checkCollisions(move).length > 0)
            return;
        move.translation.scale(1 / animationSteps);
        move.rotation.scale(1 / animationSteps);
        Episoma.ƒ.Time.game.setTimer(20, animationSteps, function (_event) {
            controlActive.move(move);
            updateDisplay();
        });
    }
    function callToAction(_message) {
        let span = document.querySelector("span#CallToAction");
        span.textContent = _message;
        span.style.animation = "none";
        isNaN(span.offsetHeight); // stupid hack to restart css-animation, read offsetHeight
        span.style.animation = null;
    }
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Main.js.map