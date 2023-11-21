import { _decorator, Component, EventTouch, Input, Node } from 'cc';
import { SynthKey } from './Synth/synth-key';
const { ccclass, property } = _decorator;

@ccclass('SoundEvent')
export class SoundEvent extends Component {
    public octave: number
    public frequency: number
    public audioContext: AudioContext = new AudioContext();
    public key: SynthKey;
    start() {

    }

    update(deltaTime: number) {

    }


    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.octave = Math.floor(2 / 12)
		this.frequency = 360;
        
    
       


    }


    onTouchStart(event: EventTouch) {
        this.playSound(500,400);
        
   


    };
    onTouchMove(event: EventTouch) {
      

    }
    onTouchEnd(event: EventTouch) {
       
     }
     playSound = function playBeep(duration: number, frequency: number) {
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(this.audioContext.destination);
      
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
      }

}



