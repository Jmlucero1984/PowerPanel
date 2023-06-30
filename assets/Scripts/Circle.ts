import { _decorator, Color, Component, EventTouch, Graphics, ImageAsset, Input, Node, ParticleAsset, ParticleSystem2D, Texture2D, v2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Circle')
export class Circle extends Graphics {

    private graph:Graphics
    start() {
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.clear();
        this.lineWidth = 50;
         
        this.strokeColor = Color.GREEN;
        this.moveTo(0,0);
        this.circle(0,0,150)
        this.stroke();
       
    }

    update(deltaTime: number) {
        this.material.setProperty("move",v2(this.node.position.x*-0.1,this.node.position.y*-0.1));
    }
 

    onTouchMove(event: EventTouch) {
 
        let pos = event.getUILocation();
        this.node.setWorldPosition(new Vec3(pos.x, pos.y, 0));
    }



    
}


