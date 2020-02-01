namespace L13_Craftris {
  import ƒ = FudgeCore;

  export interface Transformation {
    translation?: ƒ.Vector3;
    rotation?: ƒ.Vector3;
  }

  export interface Transformations {
    [keycode: string]: Transformation;
  }

  export interface Collision {
    element: GridElement;
    cube: Cube;
  }

  export class Control extends ƒ.Node {
    public static transformations: Transformations = Control.defineControls();
    private fragment: Fragment;
    private segment: number = 0;

    constructor() {
      super("Control");
      this.addComponent(new ƒ.ComponentTransform());
    }

    public static defineControls(): Transformations {
      let controls: Transformations = {};
      controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.W] = { rotation: ƒ.Vector3.Z(-1) };
      controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.S] = { rotation: ƒ.Vector3.Z(1) };
      controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.A] = { rotation: ƒ.Vector3.X(1) };
      controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.D] = { rotation: ƒ.Vector3.X(-1) };
      controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.Q] = { rotation: ƒ.Vector3.Y(1) };
      controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.E] = { rotation: ƒ.Vector3.Y(-1) };
      controls[ƒ.KEYBOARD_CODE.W] = { translation: ƒ.Vector3.Z(-1) };
      controls[ƒ.KEYBOARD_CODE.S] = { translation: ƒ.Vector3.Z(1) };
      controls[ƒ.KEYBOARD_CODE.A] = { translation: ƒ.Vector3.X(-1) };
      controls[ƒ.KEYBOARD_CODE.D] = { translation: ƒ.Vector3.X(1) };
      controls[ƒ.KEYBOARD_CODE.Q] = { translation: ƒ.Vector3.Y(1) };
      controls[ƒ.KEYBOARD_CODE.E] = { translation: ƒ.Vector3.Y(-1) };
      // controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT] = controls[ƒ.KEYBOARD_CODE.SHIFT_RIGHT] = { translation: ƒ.Vector3.Y(1) };
      // controls[ƒ.KEYBOARD_CODE.CTRL_LEFT] = controls[ƒ.KEYBOARD_CODE.CTRL_RIGHT] = { translation: ƒ.Vector3.Y(-1) };
      return controls;
    }

    public setFragment(_fragment: Fragment): void {
      for (let child of this.getChildren())
        this.removeChild(child);
      this.appendChild(_fragment);
      this.fragment = _fragment;
    }

    public pickFragment(_viewport: ƒ.Viewport, _pos: ƒ.Vector2): void {
      for (let node of this.fragment.getChildren()) {
        let projection: ƒ.Vector3 = camera.cmpCamera.project(node.mtxWorld.translation);
        // let posCanvas: ƒ.Vector2 = _viewport.pointClipToCanvas(projection.toVector2());
        let posClient: ƒ.Vector2 = _viewport.pointClipToClient(projection.toVector2());
        // ƒ.Debug.log(posCanvas.toString() + " | " + posClient.toString());
        // beware! magic numbers here...
        if (ƒ.Vector2.DIFFERENCE(_pos, posClient).magnitude < 200 - (projection.z - 0.5) * 400)
          ƒ.Debug.log(node.name + " | " + projection.toString());
      }
    }

    public move(_transformation: Transformation): void {
      let mtxContainer: ƒ.Matrix4x4 = this.cmpTransform.local;
      let mtxFragment: ƒ.Matrix4x4 = this.fragment.cmpTransform.local;
      mtxFragment.rotate(_transformation.rotation, true);
      mtxContainer.translate(_transformation.translation);
    }

    public rotatePerspektive(_angle: number): void {
      let mtxContainer: ƒ.Matrix4x4 = this.cmpTransform.local;
      let mtxFragment: ƒ.Matrix4x4 = this.fragment.cmpTransform.local;
      mtxContainer.rotateY(_angle);
      mtxFragment.rotateY(-_angle, true);
    }

    public rotateToSegment(_segment: number): void {
      while (_segment != this.segment) {
        this.rotatePerspektive(-90);
        this.segment = ++this.segment % 4;
      }
    }

    public checkCollisions(_transformation: Transformation): Collision[] {
      let mtxContainer: ƒ.Matrix4x4 = this.cmpTransform.local;
      let mtxFragment: ƒ.Matrix4x4 = this.fragment.cmpTransform.local;
      let save: ƒ.Mutator[] = [mtxContainer.getMutator(), mtxFragment.getMutator()];
      mtxFragment.rotate(_transformation.rotation, true);
      mtxContainer.translate(_transformation.translation);

      ƒ.RenderManager.update();

      let collisions: Collision[] = [];
      for (let cube of this.fragment.getChildren()) {
        let element: GridElement = grid.pull(cube.mtxWorld.translation);
        if (element)
          collisions.push({ element: element, cube: (<Cube>cube) });
      }

      mtxContainer.mutate(save[0]);
      mtxFragment.mutate(save[1]);

      return collisions;
    }

    public dropFragment(): GridElement[] {
      let frozen: GridElement[] = [];
      for (let cube of this.fragment.getChildren()) {
        let position: ƒ.Vector3 = cube.mtxWorld.translation;
        cube.cmpTransform.local.translation = position;
        let element: GridElement = new GridElement(<Cube>cube);
        grid.push(position, element);
        frozen.push(element);
      }
      for (let child of this.getChildren())
        this.removeChild(child);
      return frozen;
    }

    public isConnected(): boolean {
      let neighbors: GridElement[] = [];
      let children: ƒ.Node[] = this.fragment.getChildren();
      for (let cube of children) {
        let found: GridElement[] = <GridElement[]>grid.findNeighbors(cube.mtxWorld.translation);
        neighbors.push(...found);
      }
      return neighbors.length > 0;
    }
  }
}
