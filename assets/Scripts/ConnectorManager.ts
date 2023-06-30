import { _decorator, Component, Label, Node } from 'cc';
import { CableTerminal } from './CableTerminal';
import { ConnectorHover } from './Panel/ConnectorHover';
import Cable from './Cable';
import { Display } from './Display';
const { ccclass, property } = _decorator;

@ccclass('ConnectorManager')
export class ConnectorManager extends Component {

    @property({
        type: Label,
        tooltip: 'Dragging'
    })
    public Draggin: Label;
    @property({
        type: Label,
        tooltip: 'Over'
    })
    public Over: Label;

    public static dragginNode: Node = null;
    public static overNode: Node = null

    static tryConnect(caller: Node) {
 
            Display.print("Attemp connection...")
        if (ConnectorManager.dragginNode != null && ConnectorManager.overNode != null) {
            Display.print("Possible connection...")
            Display.print("Dragging element : " + ConnectorManager.dragginNode.parent.name)
            Display.print("Hover on element : " + ConnectorManager.overNode.name)
            let receptor = ConnectorManager.overNode.getComponent(ConnectorHover).connectedNode;
            if (receptor == null) {
                receptor.push(ConnectorManager.dragginNode);
            } else {
                let indexToInsert = -1;
                for (let i = 0; i < receptor.length; i++) {
                    Display.print("Iterating...")
                    if (receptor[i] == null) {
                        indexToInsert = i;
                        i = receptor.length;
                        Display.print("IndexToInsert: " + indexToInsert)
                    }
                }
                if (indexToInsert != -1) {
                    receptor[indexToInsert] = ConnectorManager.dragginNode;
                } else {
                    receptor.push(ConnectorManager.dragginNode);
                }
            }


            let name = ConnectorManager.dragginNode.parent.name
            if (name === "LeftTerminal") {
                Display.print("Connecting LeftTerminal...")
                ConnectorManager.dragginNode.parent.parent.getComponent(Cable).setLTerminal(ConnectorManager.overNode);
                ConnectorManager.dragginNode.parent.parent.getComponent(Cable).setTangentPosition(ConnectorManager.dragginNode,ConnectorManager.overNode);
            } else if (name === "RightTerminal") {
                Display.print("Connecting RightTerminal...")
                ConnectorManager.dragginNode.parent.parent.getComponent(Cable).setRTerminal(ConnectorManager.overNode);
                ConnectorManager.dragginNode.parent.parent.getComponent(Cable).setTangentPosition(ConnectorManager.dragginNode,ConnectorManager.overNode);
            }
            ConnectorManager.dragginNode.getComponent(CableTerminal).connectedNode = ConnectorManager.overNode;

        }
        ConnectorManager.dragginNode = null;
        ConnectorManager.overNode = null;

    }


    static disconnect(caller: Node) {
        let name = caller.parent.name
        Display.print("Disconnecting: " + name)
        if (name == "LeftTerminal") {
            Display.print("Disconnecting LEFT TERMINAL")
            let node = ConnectorManager.dragginNode.parent.parent.getComponent(Cable).getLTerminal();

            if (node != null) {
                Display.print("Disconnecting node : " + node.name)
                node.getComponent(ConnectorHover).disconnect(caller);
            }
            ConnectorManager.dragginNode.parent.parent.getComponent(Cable).setLTerminal(null);

        } else if (name == "RightTerminal") {
            Display.print("Disconnecting RIGHT TERMINAL")
            let node = ConnectorManager.dragginNode.parent.parent.getComponent(Cable).getRTerminal();

            if (node != null) {
                Display.print("Disconnecting node  : " + node.name)
                node.getComponent(ConnectorHover).disconnect(caller);
            }
            ConnectorManager.dragginNode.parent.parent.getComponent(Cable).setRTerminal(null);

        }

    }

    static touched(node: Node) {
        ConnectorManager.dragginNode = node;
        ConnectorManager.disconnect(node);


    }
    update(deltaTime: number) {

        if (ConnectorManager.dragginNode != null) {
            this.Draggin.string = "Draggin: " + ConnectorManager.dragginNode.name;
        } else {
            this.Draggin.string = "Draggin: --";
        }
        if (ConnectorManager.overNode != null) {
            this.Over.string = "Over: " + ConnectorManager.overNode.name;
        } else {
            this.Over.string = "Over: --"
        }



    }
}


