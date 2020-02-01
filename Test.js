"use strict";
var Episoma;
(function (Episoma) {
    function startTests() {
        switch (Episoma.args.get("test")) {
            case "grid":
                testGrid();
                break;
            case "combos":
                testCombos();
                break;
            case "compression":
                testCompression();
                break;
            case "camera":
                testCamera();
                break;
            case "points":
                testPoints();
                break;
            default:
                alert("Test not defined");
        }
    }
    Episoma.startTests = startTests;
    function testPoints() {
        let setups = [
            { type: Episoma.CUBE_TYPE.BLACK, positions: [[0, 0, 0]] },
            { type: Episoma.CUBE_TYPE.RED, positions: [[2, 0, 0]] },
            { type: Episoma.CUBE_TYPE.GREEN, positions: [[0, 2, 0]] },
            { type: Episoma.CUBE_TYPE.BLUE, positions: [[0, 0, 2]] }
            // { type: CUBE_TYPE.YELLOW, positions: [[-2, 0, 0]] },
            // { type: CUBE_TYPE.CYAN, positions: [[0, -2, 0]] },
            // { type: CUBE_TYPE.MAGENTA, positions: [[0, 0, -2]] }
        ];
        setupGrid(setups);
        Episoma.updateDisplay();
        let elements = Array.from(Episoma.grid.values());
        Episoma.ƒ.Debug.log(elements);
        Episoma.points.showCombo(elements, 1);
    }
    function testCamera() {
        let setups = [
            { type: Episoma.CUBE_TYPE.BLACK, positions: [[0, 0, 0]] }
        ];
        setupGrid(setups);
        Episoma.startRandomFragment();
        Episoma.ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, rotateY);
        Episoma.ƒ.Loop.start();
        // ƒ.Time.game.setTimer(4, 0, rotateY);
        function rotateY(_event) {
            Episoma.camera.rotateY(1 * Episoma.ƒ.Loop.timeFrameReal);
            // camera.rotateX(5 * Math.sin(ƒ.Time.game.get() / 100));
            Episoma.updateDisplay();
        }
    }
    async function testCompression() {
        let setups = [
            { type: Episoma.CUBE_TYPE.BLACK, positions: [[0, 0, 0]] },
            // four combos
            // { type: CUBE_TYPE.RED, positions: [[-2, -2, 0], [-2, -2, 1], [-2, -2, -1]] },
            // { type: CUBE_TYPE.GREEN, positions: [[0, -2 , 0], [1, -2, 0], [-1, -2, 0]] },
            // { type: CUBE_TYPE.BLUE, positions: [[0, 0, 2], [0, -1, 2], [0, 1, 2]] },
            // { type: CUBE_TYPE.YELLOW, positions: [[0, -2, -2], [1, -2, -2], [-1, -2, -2]] }
            // one combo travel
            // two combos following up
            { type: Episoma.CUBE_TYPE.BLUE, positions: [[-1, 0, 0], [1, 0, 0]] },
            { type: Episoma.CUBE_TYPE.RED, positions: [[-1, 0, -1], [0, 0, -1], [1, 0, -4]] },
            { type: Episoma.CUBE_TYPE.GREEN, positions: [[0, 0, -2], [1, 0, -3], [1, 0, -1]] },
            { type: Episoma.CUBE_TYPE.YELLOW, positions: [[-3, 0, -2], [0, 0, -5], [0, 0, -10]] }
        ];
        setupGrid(setups);
        Episoma.updateDisplay();
        // debugger;
        // ƒ.Time.game.setScale(0.2);
        await Episoma.ƒ.Time.game.delay(2000);
        // compressAndHandleCombos(0);
    }
    function testCombos() {
        let setups = [
            { type: Episoma.CUBE_TYPE.RED, positions: [[0, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, -1], [-1, 0, 0]] },
            { type: Episoma.CUBE_TYPE.GREEN, positions: [[-5, 0, 0], [-5, 0, 1], [-5, 1, 2], [-5, -1, 2], [-5, 0, 2]] },
            { type: Episoma.CUBE_TYPE.CYAN, positions: [[3, 0, 0], [3, 0, 1], [3, 0, 2], [3, 0, 3], [3, 0, 4], [3, 0, 5], [3, 0, 6], [3, 0, -1], [3, 0, -2]] },
            { type: Episoma.CUBE_TYPE.BLUE, positions: [[0, 3, 0], [0, 3, 1], [0, 3, 2], [1, 3, 2], [2, 3, 2], [2, 3, 1], [2, 3, 0], [1, 3, 0], [0, 3, 0]] }
        ];
        setupGrid(setups);
        // let startElements: GridElement[] = setups.map((_setup: Setup): GridElement => {
        //   return grid.pull(new ƒ.Vector3(..._setup.positions[1]));
        // });
        // let combos: Combos = new Combos(startElements);
        // handleCombos(combos, 1);
    }
    function testGrid() {
        let cube = new Episoma.Cube(Episoma.CUBE_TYPE.GREEN, Episoma.ƒ.Vector3.ZERO());
        Episoma.grid.push(cube.cmpTransform.local.translation, new Episoma.GridElement(cube));
        let pulled = Episoma.grid.pull(cube.cmpTransform.local.translation);
        logResult(cube == pulled.cube, "Grid push and pull", cube, pulled.cube, pulled);
        let popped = Episoma.grid.pop(cube.cmpTransform.local.translation);
        logResult(cube == popped.cube, "Grid pop", cube, popped.cube, popped);
        let empty = Episoma.grid.pull(cube.cmpTransform.local.translation);
        logResult(empty == undefined, "Grid element deleted");
    }
    function setupGrid(_setups) {
        _setups.forEach((_setup) => {
            _setup.positions.forEach((_position) => {
                let position = new Episoma.ƒ.Vector3(..._position);
                let cube = new Episoma.Cube(_setup.type, position);
                Episoma.grid.push(position, new Episoma.GridElement(cube));
            });
        });
    }
    function logResult(_success, ..._args) {
        let log = _success ? Episoma.ƒ.Debug.log : Episoma.ƒ.Debug.warn;
        log(`Test success: ${_success}`, _args);
    }
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Test.js.map