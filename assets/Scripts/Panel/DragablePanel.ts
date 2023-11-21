import { Canvas, Input, Label, LabelOutline } from 'cc';
import { _decorator, Component, Event, EventMouse, EventTouch, Node, Size, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DraggablePanel')
export class DraggablePanel extends Component {

    @property({type: Label})
    public Title: Node;

    @property({ type: Node })
    public CTL: Node;
    @property({type: Label})
    public TLLabel: Label;

    @property({ type: Node})
    public CBL: Node;
    @property({type: Label })
    public BLLabel: Label;

    @property({type: Node})
    public CTR: Node;
    @property({type: Label})
    public TRLabel: Label;

    @property({ type: Node})
    public CBR: Node;
    @property({ type: Label })
    public BRLabel: Label;

    @property({ type: Label })
    public ICLabel: Label;

    public TLCapacity:number;
    public TRCapacity:number;
    public BLCapacity:number;
    public BRCapacity:number;
    private InnerCapacity:number;


    start() {}

    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.InnerCapacity=Number(this.ICLabel.string);
        this.BLCapacity=Number(this.BLLabel.string);
        this.BRCapacity=Number(this.BRLabel.string);
        this.TLCapacity=Number(this.TLLabel.string);
        this.TRCapacity=Number(this.TRLabel.string);
     
    }

    onTouchStart(event: EventTouch) {

 
    };
    onTouchMove(event: EventTouch) {
 
        this.node.setWorldPosition(new Vec3(this.node.getWorldPosition().x+event.getDeltaX(),this.node.getWorldPosition().y+event.getDeltaY()));
    }
    onTouchEnd(event: EventTouch) {}
 

    update(deltaTime: number) {
        if(this.BLCapacity>-50){
            let delta= 50+this.BLCapacity
            this.BLCapacity-=delta
            this.InnerCapacity+=delta/2;

       
        }
        if(this.TLCapacity>-50){
            let delta= 50+this.TLCapacity
            this.TLCapacity-=delta
            this.InnerCapacity+=delta/2;

       
        }
        if(this.TRCapacity<50&&this.InnerCapacity>0){
            let delta=50-this.TRCapacity
            if(this.InnerCapacity>=delta+1){
                this.InnerCapacity-=delta+1;
                this.TRCapacity+=delta
            } else{
                this.InnerCapacity--
                this.TRCapacity++
            }
        }
        if(this.BRCapacity<50&&this.InnerCapacity>0){
            let delta=50-this.BRCapacity
            if(this.InnerCapacity>=delta+1){
                this.InnerCapacity-=delta+1;
                this.BRCapacity+=delta
            } else{
                this.InnerCapacity--
                this.BRCapacity++
            }
        }
        
        this.BLLabel.string=String(this.BLCapacity);
        this.BRLabel.string=String(this.BRCapacity);
        this.TLLabel.string=String(this.TLCapacity);
        this.TRLabel.string=String(this.TRCapacity);
        this.ICLabel.string=String(Math.round(this.InnerCapacity));
 
    }
}


