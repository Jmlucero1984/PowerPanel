 


import { _decorator, Color, Component, EventTouch, Graphics, ImageAsset, Input, Node, ParticleAsset, ParticleSystem2D, Texture2D, v2, Vec3 } from 'cc';
import { MegaGraphics } from './MegaGraphics';
 
const { ccclass, property } = _decorator;

@ccclass('FilledCircleTextured')
export class FilledCircleTextured extends Graphics {

    private graph:Graphics
    start() {
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.clear();
        this.lineWidth = 15
        this.strokeColor=Color.BLACK;
        this.moveTo(0,0);
        this.lineTo(50,50)
        this.lineTo(100,50);
        this.lineTo(250,20)
        this.lineTo(250,-180)
        this.lineTo(0,-180)
        this.close();
      

   
        this.fillColor=Color.RED;
        this.fill()
        this.stroke();
    
 
       
    }
 
    update(deltaTime: number) {
   
    }
 

    onTouchMove(event: EventTouch) {
 
        let pos = event.getUILocation();
        this.node.setWorldPosition(new Vec3(pos.x, pos.y, 0));
    }



    
}


