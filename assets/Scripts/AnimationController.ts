import { _decorator, Animation, AnimationClip, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationController')
export class AnimationController extends Component {

    @property({
        type: AnimationClip
    })
    public animation: AnimationClip;
    onLoad() {
        this.animation.wrapMode=AnimationClip.WrapMode.Loop;
      
       
        
    }
 
    start() {
            

    }

    update(deltaTime: number) {
        
    }
}


