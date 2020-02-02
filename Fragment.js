"use strict";
var Episoma;
(function (Episoma) {
    var ƒ = FudgeCore;
    class Fragment extends ƒ.Node {
        constructor(_shape, _position = ƒ.Vector3.ZERO()) {
            super("Fragment-Type" + _shape);
            this.position = new ƒ.Vector3(0, 0, 0);
            let shape = Fragment.shapes[_shape];
            let type;
            do {
                type = Fragment.getRandomEnum(Episoma.CUBE_TYPE);
            } while (type == Episoma.CUBE_TYPE.BLACK);
            for (let position of shape) {
                let vctPosition = ƒ.Vector3.ZERO();
                vctPosition.set(position[0], position[1], position[2]);
                let cube = new Episoma.Cube(type, vctPosition);
                this.appendChild(cube);
            }
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
        }
        static getRandom() {
            let shape = Math.floor(Math.random() * Fragment.shapes.length);
            let fragment = new Fragment(shape);
            return fragment;
        }
        static getShapeArray() {
            return [
                // corner
                [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
                // L_small
                [[0, 0, 0], [1, 0, 0], [0, 1, 0]],
                // s
                [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, -1, 0]],
                // L_long
                [[0, 0, 0], [0, 1, 0], [0, 2, 0], [1, 0, 0]],
                // T
                [[0, 0, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0]],
                // crook_left
                [[0, 0, 0], [0, 1, 0], [0, 0, -1], [-1, 0, -1]],
                // crook_right
                [[0, 0, 0], [0, 1, 0], [0, 0, -1], [1, 0, -1]]
            ];
        }
        static getRandomEnum(_enum) {
            let randomKey = Object.keys(_enum)[Math.floor(Math.random() * Object.keys(_enum).length)];
            return _enum[randomKey];
        }
    }
    Fragment.shapes = Fragment.getShapeArray();
    Episoma.Fragment = Fragment;
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Fragment.js.map