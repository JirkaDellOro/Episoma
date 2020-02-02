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
      { type: CUBE_TYPE.GREEN, position: [-1, -1, -1], cubes: [[0, 0, 0], [1, 0, 0], [0, 0, 1], [0, 1, 0]] }
    ]
  };

  export class Body {
    public controls: Control[] = [];

    constructor(_fragmentData: FragmentData[]) {
      let first: boolean = true;
      for (let data of _fragmentData) {
        let fragment: Fragment = new Fragment(data.cubes, data.type);
        let control: Control = new Control();
        control.setFragment(fragment);
        control.move({ translation: new ƒ.Vector3(...data.position), rotation: ƒ.Vector3.ZERO() });
        game.appendChild(control);
        if (first)
          control.freezeFragment(true);
        else
          this.controls.push(control);
        first = false;
      }
    }

    public explode(): void {
      let positions: ƒ.Vector3[] = [...Grid.cardinals];
      for (let z: number = -1; z < 2; z++)
        positions = positions.concat([new ƒ.Vector3(1, 1, z), new ƒ.Vector3(1, -1, z), new ƒ.Vector3(-1, 1, z), new ƒ.Vector3(-1, -1, z)]);

      let random: ƒ.Random = new ƒ.Random();
      let moves: Transformation[] = [];
      for (let control of this.controls) {
        let position: ƒ.Vector3 = random.splice(positions);
        position.scale(3);
        let rotation: ƒ.Vector3 = random.splice([ƒ.Vector3.X(), ƒ.Vector3.Y(), ƒ.Vector3.Z()]);
        rotation.scale(random.getRangeFloored(-5, 6));
        let transform: Transformation = { translation: position, rotation: rotation };
        let move: Transformation = control.getFullTransformation(transform);
        move.translation.scale(1 / 20);
        move.rotation.scale(1 / 20);
        moves.push(move);
      }
      ƒ.Time.game.setTimer(20, 20, (_event: ƒ.EventTimer): void => {
        for (let index in this.controls) {
          this.controls[index].move(moves[index]);
          if (_event.lastCall)
            this.controls[index].freezeFragment();
        }
        updateDisplay();
      });
    }
  }
}