"use strict";
var L13_Craftris;
(function (L13_Craftris) {
    var ƒ = FudgeCore;
    class Control extends ƒ.Node {
        constructor() {
            super("Control");
            this.segment = 0;
            this.addComponent(new ƒ.ComponentTransform());
        }
        static defineControls() {
            let controls = {};
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
        setFragment(_fragment) {
            for (let child of this.getChildren())
                this.removeChild(child);
            this.appendChild(_fragment);
            this.fragment = _fragment;
        }
        pickFragment(_viewport, _pos) {
            for (let node of this.fragment.getChildren()) {
                let projection = L13_Craftris.camera.cmpCamera.project(node.mtxWorld.translation);
                // let posCanvas: ƒ.Vector2 = _viewport.pointClipToCanvas(projection.toVector2());
                let posClient = _viewport.pointClipToClient(projection.toVector2());
                // ƒ.Debug.log(posCanvas.toString() + " | " + posClient.toString());
                // beware! magic numbers here...
                if (ƒ.Vector2.DIFFERENCE(_pos, posClient).magnitude < 200 - (projection.z - 0.5) * 400)
                    ƒ.Debug.log(node.name + " | " + projection.toString());
            }
        }
        move(_transformation) {
            let mtxContainer = this.cmpTransform.local;
            let mtxFragment = this.fragment.cmpTransform.local;
            mtxFragment.rotate(_transformation.rotation, true);
            mtxContainer.translate(_transformation.translation);
        }
        rotatePerspektive(_angle) {
            let mtxContainer = this.cmpTransform.local;
            let mtxFragment = this.fragment.cmpTransform.local;
            mtxContainer.rotateY(_angle);
            mtxFragment.rotateY(-_angle, true);
        }
        rotateToSegment(_segment) {
            while (_segment != this.segment) {
                this.rotatePerspektive(-90);
                this.segment = ++this.segment % 4;
            }
        }
        checkCollisions(_transformation) {
            let mtxContainer = this.cmpTransform.local;
            let mtxFragment = this.fragment.cmpTransform.local;
            let save = [mtxContainer.getMutator(), mtxFragment.getMutator()];
            mtxFragment.rotate(_transformation.rotation, true);
            mtxContainer.translate(_transformation.translation);
            ƒ.RenderManager.update();
            let collisions = [];
            for (let cube of this.fragment.getChildren()) {
                let element = L13_Craftris.grid.pull(cube.mtxWorld.translation);
                if (element)
                    collisions.push({ element: element, cube: cube });
            }
            mtxContainer.mutate(save[0]);
            mtxFragment.mutate(save[1]);
            return collisions;
        }
        dropFragment() {
            let frozen = [];
            for (let cube of this.fragment.getChildren()) {
                let position = cube.mtxWorld.translation;
                cube.cmpTransform.local.translation = position;
                let element = new L13_Craftris.GridElement(cube);
                L13_Craftris.grid.push(position, element);
                frozen.push(element);
            }
            for (let child of this.getChildren())
                this.removeChild(child);
            return frozen;
        }
        isConnected() {
            let neighbors = [];
            let children = this.fragment.getChildren();
            for (let cube of children) {
                let found = L13_Craftris.grid.findNeighbors(cube.mtxWorld.translation);
                neighbors.push(...found);
            }
            return neighbors.length > 0;
        }
    }
    Control.transformations = Control.defineControls();
    L13_Craftris.Control = Control;
})(L13_Craftris || (L13_Craftris = {}));
//# sourceMappingURL=Control.js.map