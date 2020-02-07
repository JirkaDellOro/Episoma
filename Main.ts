namespace Episoma {
  export import ƒ = FudgeCore;

  enum GAME_STATE {
    START, MENU, PLAY, OVER
  }

  // window.addEventListener("load", hndLoad);
  document.addEventListener("click", hndLoad);

  export let game: ƒ.Node = new ƒ.Node("FudgeCraft");
  export let grid: Grid = new Grid();
  export let args: URLSearchParams;
  export let camera: CameraOrbit;
  // export let points: Points;
  export let body: Body;

  let state: GAME_STATE = GAME_STATE.START;
  let controlActive: Control;
  // let controls: Control[] = [];
  let viewport: ƒ.Viewport;
  let speedCameraRotation: number = 0.2;
  let speedCameraTranslation: number = 0.02;


  async function hndLoad(_event: Event): Promise<void> {
    document.removeEventListener("click", hndLoad);
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    args = new URLSearchParams(location.search);
    ƒ.RenderManager.initialize(true, true);
    ƒ.Debug.log("Canvas", canvas);

    Audio.start();

    // enable unlimited mouse-movement (user needs to click on canvas first)
    canvas.addEventListener("mousedown", canvas.requestPointerLock);
    canvas.addEventListener("mouseup", () => document.exitPointerLock());
    canvas.addEventListener("click", handleClick);

    // set lights
    let cmpLight: ƒ.ComponentLight = new ƒ.ComponentLight(new ƒ.LightDirectional(ƒ.Color.CSS("WHITE")));
    cmpLight.pivot.lookAt(new ƒ.Vector3(0.5, -1, -0.8));
    let cmpLightAmbient: ƒ.ComponentLight = new ƒ.ComponentLight(new ƒ.LightAmbient(new ƒ.Color(0.25, 0.25, 0.25, 1)));
    game.addComponent(cmpLightAmbient);

    // setup orbiting camera
    camera = new CameraOrbit(75);
    game.appendChild(camera);
    camera.setRotationX(-20);
    camera.setRotationY(20);
    camera.cmpCamera.getContainer().addComponent(cmpLight);

    // setup viewport
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", game, camera.cmpCamera, canvas);
    ƒ.Debug.log("Viewport", viewport);
    // points = new Points(viewport, document.querySelector("#Score"), document.querySelector("div#Calculation"));

    // setup event handling
    viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
    viewport.activateWheelEvent(ƒ.EVENT_WHEEL.WHEEL, true);
    viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, hndPointerMove);
    viewport.addEventListener(ƒ.EVENT_WHEEL.WHEEL, hndWheelMove);

    start();

    controlActive = body.controls[0];

    updateDisplay();
    ƒ.Debug.log("Game", game);
  }

  function setState(_new: GAME_STATE): void {
    state = _new;
    ƒ.Debug.log("State", state);
  }

  async function start(): Promise<void> {
    setState(GAME_STATE.MENU);
    body = new Body(bodyData["Cube"]);

    ƒ.Debug.log("Wait for space");
    await waitForKeyPress(ƒ.KEYBOARD_CODE.SPACE);
    ƒ.Debug.log("Space pressed");
    body.explode();

    Audio.play(AUDIO.START, false);
    Audio.play(AUDIO.PLAY);
    Audio.play(AUDIO.CRASH);

    let domMenu: HTMLElement = document.querySelector("div#Menu");
    domMenu.style.visibility = "hidden";
    window.addEventListener("keydown", hndKeyDown);  // activate when user starts...
    startCountDown();
    setState(GAME_STATE.PLAY);
  }

  function end(): void {
    let domOver: HTMLElement = document.querySelector("div#Over");
    domOver.style.visibility = "visible";
    window.removeEventListener("keydown", hndKeyDown);  // activate when user starts...
    setState(GAME_STATE.OVER);
  }

  async function waitForKeyPress(_code: ƒ.KEYBOARD_CODE): Promise<void> {
    return new Promise(_resolve => {
      window.addEventListener("keydown", hndKeyDown);
      function hndKeyDown(_event: KeyboardEvent): void {
        if (_event.code == _code) {
          window.removeEventListener("keydown", hndKeyDown);
          _resolve();
        }
      }
    });
  }

  function startCountDown(): void {
    let countDown: ƒ.Time = new ƒ.Time();
    countDown.setTimer(1000, 0, showCountDown);
    function showCountDown(_event: ƒ.EventTimer): void {
      let time: number = 3 * 60 * 1000 - countDown.get();
      displayTime(time);
      if (time < 0) {
        countDown.clearAllTimers();
        displayTime(0);
        end();
      }
    }
  }

  function displayTime(_time: number): void {
    let units: ƒ.TimeUnits = ƒ.Time.getUnits(_time);
    let domTime: HTMLElement = document.querySelector("h1#Time");
    domTime.textContent = units.minutes.toString().padStart(2, "0") + ":" + units.seconds.toString().padStart(2, "0");
  }
  export function updateDisplay(): void {
    viewport.draw();
  }

  //#region Interaction
  function handleClick(_event: MouseEvent): void {
    if (ƒ.Time.game.hasTimers())
      return;
    let mouse: ƒ.Vector2 = new ƒ.Vector2(_event.offsetX, _event.offsetY);

    let pickResults: { distance: number, control: Control }[] = [];
    for (let control of body.controls)
      pickResults.push({ distance: control.pickFragment(viewport, mouse), control: control });
    pickResults.sort((_a, _b) => _a.distance < _b.distance || !_b.distance ? -1 : 1);
    ƒ.Debug.log(pickResults);
    if (pickResults[0]) {
      controlActive.freezeFragment();
      controlActive = pickResults[0].control;
      controlActive.unfreezeFragment();
    }

    controlActive.rotateToSegment(camera.getSegmentY());
  }

  function hndPointerMove(_event: ƒ.EventPointer): void {
    if (!_event.buttons)
      return;

    camera.rotateY(_event.movementX * speedCameraRotation);
    camera.rotateX(_event.movementY * speedCameraRotation);

    if (!ƒ.Time.game.hasTimers())
      controlActive.rotateToSegment(camera.getSegmentY());

    updateDisplay();
  }

  function hndWheelMove(_event: WheelEvent): void {
    camera.translate(_event.deltaY * speedCameraTranslation);
    updateDisplay();
  }

  function hndKeyDown(_event: KeyboardEvent): void {
    if (ƒ.Time.game.hasTimers())
      return;

    let code: string = (_event.shiftKey ? ƒ.KEYBOARD_CODE.SHIFT_LEFT : "") + _event.code;
    let transformation: Transformation = Control.transformations[code];
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
}