"use strict";
var Episoma;
(function (Episoma) {
    var ƒ = FudgeCore;
    let AUDIO;
    (function (AUDIO) {
        AUDIO["START"] = "Sound/Start.mp3";
        AUDIO["PLAY"] = "Sound/Play.mp3";
        AUDIO["HIT"] = "Sound/Hit.mp3";
        AUDIO["ROTATE"] = "Sound/Rotate.mp3";
        AUDIO["MOVE"] = "Sound/Move.mp3";
        AUDIO["CRASH"] = "Sound/Crash.mp3";
    })(AUDIO = Episoma.AUDIO || (Episoma.AUDIO = {}));
    let Audio = /** @class */ (() => {
        class Audio extends ƒ.Node {
            static start() {
                Audio.appendAudio();
                Episoma.game.appendChild(Audio.node);
                ƒ.AudioManager.default.listenTo(Audio.node);
            }
            static play(_audio, _on = true) {
                ƒ.Debug.log(_audio);
                Audio.components.get(_audio).play(_on);
            }
            static async appendAudio() {
                Audio.components.set(AUDIO.START, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.START), true, true));
                Audio.components.set(AUDIO.PLAY, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.PLAY), true, false));
                Audio.components.set(AUDIO.HIT, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.HIT), false, false));
                Audio.components.set(AUDIO.MOVE, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.MOVE), false, false));
                Audio.components.set(AUDIO.ROTATE, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.ROTATE), false, false));
                Audio.components.set(AUDIO.CRASH, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.CRASH), false, false));
                Audio.components.forEach(element => Audio.node.addComponent(element));
            }
        }
        Audio.components = new Map();
        Audio.node = new Audio("Audio");
        return Audio;
    })();
    Episoma.Audio = Audio;
})(Episoma || (Episoma = {}));
//# sourceMappingURL=Audio.js.map