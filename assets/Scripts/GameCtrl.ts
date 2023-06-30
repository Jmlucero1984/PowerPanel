import { _decorator, CCInteger, Component, Node } from 'cc';
import { Ground_Node } from './Ground_node';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {
     
    @property({
        type: Ground_Node,
        tooltip: 'This is ground'
    })

    public ground:Ground_Node

    @property ({
        type:CCInteger
    })
    public speed: number;

    @property ({
        type: CCInteger
    })
    public pipeSpeed: number = 200;

 

    onUpdate() {
 
    }

    onLoad() {
        this.ground.gameSpeed=this.speed;
    }
    initListener() {

    }

    startGame() {

    }

}


