namespace Episoma {
  interface FragmentData {
    type: CUBE_TYPE;
    // alpha: number;
    position: number[];
    cubes: number[][];
  }

  interface BodyData {
    [name: string]: FragmentData[];
  }

  export let bodyData: BodyData = {
    Cube: [
      { type: CUBE_TYPE.BLACK, position: [0, 0, 0], cubes: [[0, 0, 0], [0, 0, -1], [-1, 0, 0]] },
      { type: CUBE_TYPE.RED, position: [-1, 1, 0], cubes: [[0, 0, 0], [0, 0, 1], [0, 0, -1], [1, 0, 0]] },
      { type: CUBE_TYPE.YELLOW, position: [1, 1, 0], cubes: [[0, 0, 0], [0, 0, -1], [-1, 0, -1], [0, 0, 1]] },
      { type: CUBE_TYPE.CYAN, position: [0, 0, 1], cubes: [[0, 0, 0], [0, 1, 0], [-1, 0, 0], [-1, -1, 0]] },
      { type: CUBE_TYPE.MAGENTA, position: [1, 0, 1], cubes: [[0, 0, 0], [0, 0, -1], [0, -1, 0], [-1, -1, 0]] },
      { type: CUBE_TYPE.BLUE, position: [1, -1, 0], cubes: [[0, 0, 0], [-1, 0, 0], [0, 0, -1], [0, 1, -1]] },
      { type: CUBE_TYPE.RED, position: [-1, -1, -1], cubes: [[0, 0, 0], [1, 0, 0], [0, 0, 1], [0, 1, 0]] }
    ]
  };

  export class Body {
    public controls: Control[] = [];

    constructor(_fragmentData: FragmentData[]) {
      for (let data of _fragmentData) {
        let fragment: Fragment = new Fragment(data.cubes, data.type);
        let control: Control = new Control();
        // control.cmpTransform.local.translation = ƒ.Vector3.ZERO();
        control.setFragment(fragment);
        control.move({ translation: new ƒ.Vector3(...data.position), rotation: ƒ.Vector3.ZERO() });
        game.appendChild(control);
        this.controls.push(control);
      }
    }
  }
}