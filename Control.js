"use strict";
var Episoma;
(function (Episoma) {
    var ƒ = FudgeCore;
    class Control extends ƒ.Node {
        constructor() {
            super("Control");
            this.segment = 0;
            this.addComponent(new ƒ.ComponentTransform());
        }
        static defineControls() {
            let controls = {};
            controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.W] = { rotation: ƒ.Vector3.X(-1) };
            controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.S] = { rotation: ƒ.Vector3.X(1) };
            controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.A] = { rotation: ƒ.Vector3.Y(-1) };
            controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.D] = { rotation: ƒ.Vector3.Y(1) };
            controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.Q] = { rotation: ƒ.Vector3.Z(1) };
            controls[ƒ.KEYBOARD_CODE.SHIFT_LEFT + ƒ.KEYBOARD_CODE.E] = { rotation: ƒ.Vector3.Z(-1) };
            controls[ƒ.KEYBOARD_CODE.W] = { translation: ƒ.Vector3.Z(-1) };
            controls[ƒ.KEYBOARD_CODE.S] = { translation: ƒ.Vector3.Z(1) };
            controls[ƒ.KEYBOARD_CODE.A] = { translation: ƒ.Vector3.X(-1) };
            controls[ƒ.KEYBOARD_CODE.D] = { translation: ƒ.Vector3.X(1) };
            controls[ƒ.KEYBOARD_CODE.E] = { translation: ƒ.Vector3.Y(1) };
            controls[ƒ.KEYBOARD_CODE.X] = { translation: ƒ.Vector3.Y(-1) };
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
                let projection = Episoma.camera.cmpCamera.project(node.mtxWorld.translation);
                let posClient = _viewport.pointClipToClient(projection.toVector2());
                // beware! magic numbers here...
                if (ƒ.Vector2.DIFFERENCE(_pos, posClient).magnitude < 200 - (projection.z - 0.5) * 400)
                    // ƒ.Debug.log(node.name + " | " + projection.toString());
                    return true;
            }
            return false;
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
        moveTo(_transformation, _animationSteps = 5, _checkCollision = true) {
            let move = this.getFullTransformation(_transformation);
            if (_checkCollision && this.checkCollisions(move).length > 0) {
                Episoma.Audio.play(Episoma.AUDIO.HIT);
                return;
            }
            move.translation.scale(1 / _animationSteps);
            move.rotation.scale(1 / _animationSteps);
            Episoma.Audio.play(_transformation.rotation ? Episoma.AUDIO.ROTATE : Episoma.AUDIO.MOVE);
            ƒ.Time.game.setTimer(20, _animationSteps, (_event) => {
                this.move(move);
                Episoma.updateDisplay();
            });
        }
        getFullTransformation(_transformation) {
            let fullRotation = 90;
            let fullTranslation = 1;
            let result = {
                rotation: _transformation.rotation ? ƒ.Vector3.SCALE(_transformation.rotation, fullRotation) : new ƒ.Vector3(),
                translation: _transformation.translation ? ƒ.Vector3.SCALE(_transformation.translation, fullTranslation) : new ƒ.Vector3()
            };
            return result;
        }
        rotateToSegment(_segment) {
            // ƒ.Debug.log(_segment, this.segment);
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
                let element = Episoma.grid.pull(cube.mtxWorld.translation);
                if (element)
                    collisions.push({ element: element, cube: cube });
            }
            mtxContainer.mutate(save[0]);
            mtxFragment.mutate(save[1]);
            return collisions;
        }
        freezeFragment(_moveToGrid = false) {
            Episoma.updateDisplay();
            for (let cube of this.fragment.getChildren()) {
                let position = cube.mtxWorld.translation;
                let element = new Episoma.GridElement(cube);
                Episoma.grid.push(position, element, _moveToGrid);
            }
        }
        unfreezeFragment() {
            for (let cube of this.fragment.getChildren()) {
                let position = cube.mtxWorld.translation;
                Episoma.grid.pop(position);
            }
        }
        isConnected() {
            let neighbors = [];
            let children = this.fragment.getChildren();
            for (let cube of children) {
                let found = Episoma.grid.findNeighbors(cube.mtxWorld.translation);
                neighbors.push(...found);
            }
            return neighbors.length > 0;
        }
    }
    Control.transformations = Control.defineControls();
    Episoma.Control = Control;
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Control.js.map