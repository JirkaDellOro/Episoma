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
            { type: Episoma.CUBE_TYPE.GREEN, position: [-1, -1, -1], cubes: [[0, 0, 0], [1, 0, 0], [0, 0, 1], [0, 1, 0]] }
        ]
    };
    class Body {
        constructor(_fragmentData) {
            this.controls = [];
            let first = true;
            for (let data of _fragmentData) {
                let fragment = new Episoma.Fragment(data.cubes, data.type);
                let control = new Episoma.Control();
                control.setFragment(fragment);
                control.move({ translation: new Episoma.ƒ.Vector3(...data.position), rotation: Episoma.ƒ.Vector3.ZERO() });
                Episoma.game.appendChild(control);
                if (first)
                    control.freezeFragment(true);
                else
                    this.controls.push(control);
                first = false;
            }
        }
        explode() {
            let positions = [...Episoma.Grid.cardinals];
            for (let z = -1; z < 2; z++)
                positions = positions.concat([new Episoma.ƒ.Vector3(1, 1, z), new Episoma.ƒ.Vector3(1, -1, z), new Episoma.ƒ.Vector3(-1, 1, z), new Episoma.ƒ.Vector3(-1, -1, z)]);
            let random = new Episoma.ƒ.Random();
            let moves = [];
            for (let control of this.controls) {
                let position = random.splice(positions);
                position.scale(3);
                let rotation = random.splice([Episoma.ƒ.Vector3.X(), Episoma.ƒ.Vector3.Y(), Episoma.ƒ.Vector3.Z()]);
                rotation.scale(random.getRangeFloored(-5, 6));
                let transform = { translation: position, rotation: rotation };
                let move = control.getFullTransformation(transform);
                move.translation.scale(1 / 20);
                move.rotation.scale(1 / 20);
                moves.push(move);
            }
            Episoma.ƒ.Time.game.setTimer(20, 20, (_event) => {
                for (let index in this.controls) {
                    this.controls[index].move(moves[index]);
                    if (_event.lastCall)
                        this.controls[index].freezeFragment();
                }
                Episoma.updateDisplay();
            });
        }
    }
    Episoma.Body = Body;
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Body.js.map