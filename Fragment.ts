namespace Episoma {
  import ƒ = FudgeCore;

  export class Fragment extends ƒ.Node {
    // private static shapes: number[][][] = Fragment.getShapeArray();
    public position: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);

    constructor(_shape: number[][], _type: CUBE_TYPE) {
      super("Fragment");
      for (let position of _shape) {
        let vctPosition: ƒ.Vector3 = ƒ.Vector3.ZERO();
        vctPosition.set(position[0], position[1], position[2]);
        let cube: Cube = new Cube(_type, vctPosition);
        this.appendChild(cube);
      }

      this.addComponent(new ƒ.ComponentTransform());
    }

    // public static getRandom(): Fragment {
    //   let shape: number = Math.floor(Math.random() * Fragment.shapes.length);
    //   let fragment: Fragment = new Fragment(shape);
    //   return fragment;
    // }

    // private static getShapeArray(): number[][][] {
    //   return [
    //     // corner
    //     [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
    //     // L_small
    //     [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
    //     // s
    //     [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, -1, 0]],
    //     // L_long
    //     [[0, 0, 0], [0, 1, 0], [0, 2, 0], [1, 0, 0]],
    //     // T
    //     [[0, 0, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0]],
    //     // crook_left
    //     [[0, 0, 0], [0, 1, 0], [0, 0, -1], [-1, 0, -1]],
    //     // crook_right
    //     [[0, 0, 0], [0, 1, 0], [0, 0, -1], [1, 0, -1]]
    //   ];
    // }

    // private static getRandomEnum<T>(_enum: { [key: string]: T }): T {
    //   let randomKey: string = Object.keys(_enum)[Math.floor(Math.random() * Object.keys(_enum).length)];
    //   return _enum[randomKey];
    // }
  }
}