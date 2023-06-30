import { _decorator, Color, Component, Graphics, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CableUI_render')
export class CableUI_render extends Graphics {
    @property(Node)
    private LeftTerminal: Node;
 
    @property(Node)
    private RightTerminal: Node;
 
    start() {
        this.clear();
        this.lineWidth = 5;

        this.strokeColor = Color.GREEN;
        this.moveTo(this.RightTerminal.position.x,this.RightTerminal.position.y)
        this.lineTo(this.LeftTerminal.position.x,this.LeftTerminal.position.y)
     

  
        this.stroke();
    }

    update(deltaTime: number) {
        
    }
}


