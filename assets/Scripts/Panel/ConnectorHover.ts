import { _decorator, Component, EventMouse, Node, SpriteFrame, UIOpacity } from 'cc';
import { ConnectorManager } from '../ConnectorManager';
import { DraggablePanel } from './DragablePanel';
const { ccclass, property } = _decorator;

@ccclass('ConnectorHover')
export class ConnectorHover extends Component {


    @property({
        type: Node
    })
    public connectorWhite: Node;


    public connectedNode: Node[]=[];

    public capacidad:Number;
    
    disconnect(caller:Node) {
        console.log(this.node.name+" desconectó a "+caller.name)
        for(let i=0;i<this.connectedNode.length;i++){
     
            if(this.connectedNode[i] ==caller) {
                console.log("HUBO COINCIDENDICA")
                this.connectedNode[i]=null;
            }
        }
 
    }
    getCapacity(){
        switch(this.node.name) {
            case "Connector TR": {
                return this.node.parent.getComponent(DraggablePanel).TRCapacity;
                break;
            }
            case "Connector BR": {
                return this.node.parent.getComponent(DraggablePanel).BRCapacity;
                break;
            }
            case "Connector TL": {
                return this.node.parent.getComponent(DraggablePanel).TLCapacity;
                break;
            }
            case "Connector BL": {
                return this.node.parent.getComponent(DraggablePanel).BLCapacity;
                break;
            }
        }

    }
    changeCapacity(valor:number){
        switch(this.node.name) {
            case "Connector TR": {
                this.node.parent.getComponent(DraggablePanel).TRCapacity+=valor;
                break;
            }
            case "Connector BR": {
                this.node.parent.getComponent(DraggablePanel).BRCapacity+=valor;
                break;
            }
            case "Connector TL": {
                this.node.parent.getComponent(DraggablePanel).TLCapacity+=valor;
                break;
            }
            case "Connector BL": {
                this.node.parent.getComponent(DraggablePanel).BLCapacity+=valor;
                break;
            }
        }

    }


    onLoad() {
        this.node.on(Node.EventType.MOUSE_ENTER, (event: EventMouse) => {
            ConnectorManager.overNode=this.node;
            this.connectorWhite.getComponent(UIOpacity).opacity = 0;
        })
        this.node.on(Node.EventType.MOUSE_LEAVE, (event: EventMouse) => {
            ConnectorManager.overNode=null;
            this.connectorWhite.getComponent(UIOpacity).opacity = 255;
        })
        
    }
    update() {
       
        if(this.connectedNode!=null && ConnectorManager.dragginNode==null) {
           
            let pos=this.node.getWorldPosition();
            this.connectedNode.forEach(element => {
                if(element!=null) {
                    element.parent.worldPosition=pos;
                }
                
            });
           
        }
    }
}





