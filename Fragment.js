"use strict";
var Episoma;
(function (Episoma) {
    var ƒ = FudgeCore;
    class Fragment extends ƒ.Node {
        constructor(_shape, _type) {
            super("Fragment");
            // private static shapes: number[][][] = Fragment.getShapeArray();
            this.position = new ƒ.Vector3(0, 0, 0);
            for (let position of _shape) {
                let vctPosition = ƒ.Vector3.ZERO();
                vctPosition.set(position[0], position[1], position[2]);
                let cube = new Episoma.Cube(_type, vctPosition);
                this.appendChild(cube);
            }
            this.addComponent(new ƒ.ComponentTransform());
        }
    }
    Episoma.Fragment = Fragment;
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Fragment.js.map