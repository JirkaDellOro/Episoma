"use strict";
var Episoma;
(function (Episoma) {
    Episoma.bodyData = {
        Cube: [
            { type: Episoma.CUBE_TYPE.BLACK, position: [0, 0, 0], cubes: [[0, 0, 0], [0, 0, -1], [-1, 0, 0]] },
            { type: Episoma.CUBE_TYPE.RED, position: [-1, 1, 0], cubes: [[0, 0, 0], [0, 0, 1], [0, 0, -1], [1, 0, 0]] },
            { type: Episoma.CUBE_TYPE.YELLOW, position: [1, 1, 0], cubes: [[0, 0, 0], [0, 0, -1], [-1, 0, -1], [0, 0, 1]] },
            { type: Episoma.CUBE_TYPE.CYAN, position: [0, 0, 1], cubes: [[0, 0, 0], [0, 1, 0], [-1, 0, 0], [-1, -1, 0]] },
            { type: Episoma.CUBE_TYPE.MAGENTA, position: [1, 0, 1], cubes: [[0, 0, 0], [0, 0, -1], [0, -1, 0], [-1, -1, 0]] },
            { type: Episoma.CUBE_TYPE.BLUE, position: [1, -1, 0], cubes: [[0, 0, 0], [-1, 0, 0], [0, 0, -1], [0, 1, -1]] },
            { type: Episoma.CUBE_TYPE.RED, position: [-1, -1, -1], cubes: [[0, 0, 0], [1, 0, 0], [0, 0, 1], [0, 1, 0]] }
        ]
    };
    class Body {
        constructor(_fragmentData) {
            this.controls = [];
            for (let data of _fragmentData) {
                let fragment = new Episoma.Fragment(data.cubes, data.type);
                let control = new Episoma.Control();
                // control.cmpTransform.local.translation = ƒ.Vector3.ZERO();
                control.setFragment(fragment);
                control.move({ translation: new Episoma.ƒ.Vector3(...data.position), rotation: Episoma.ƒ.Vector3.ZERO() });
                Episoma.game.appendChild(control);
                this.controls.push(control);
            }
        }
    }
    Episoma.Body = Body;
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Body.js.map