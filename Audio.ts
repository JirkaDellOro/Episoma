namespace Episoma {
  import ƒ = FudgeCore;

  export enum AUDIO {
    START = "Sound/Start.mp3",
    PLAY = "Sound/Play.mp3",
    HIT = "Sound/Hit.mp3",
    ROTATE = "Sound/Rotate.mp3",
    MOVE = "Sound/Move.mp3",
    CRASH = "Sound/Crash.mp3"
  }

  export class Audio extends ƒ.Node {
    private static components: Map<AUDIO, ƒ.ComponentAudio> = new Map();
    private static readonly node: Audio = new Audio("Audio");
    
    public static start(): void {
      Audio.appendAudio();
      game.appendChild(Audio.node);
      ƒ.AudioManager.default.listenTo(Audio.node);
    }

    public static play(_audio: AUDIO, _on: boolean = true): void {
      ƒ.Debug.log(_audio);
      Audio.components.get(_audio).play(_on);
    }

    private static async appendAudio(): Promise<void> {
      Audio.components.set(AUDIO.START, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.START), true, true));
      Audio.components.set(AUDIO.PLAY, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.PLAY), true, false));
      Audio.components.set(AUDIO.HIT, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.HIT), false, false));
      Audio.components.set(AUDIO.MOVE, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.MOVE), false, false));
      Audio.components.set(AUDIO.ROTATE, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.ROTATE), false, false));
      Audio.components.set(AUDIO.CRASH, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.CRASH), false, false));

      Audio.components.forEach(element => Audio.node.addComponent(element));
    }
  }
}