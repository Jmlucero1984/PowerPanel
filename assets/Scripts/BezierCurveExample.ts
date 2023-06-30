import { _decorator, Component, Node, Sprite, v2, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BezierCurveExample')
export class BezierCurveExample extends Component {
    @property(Node)
    private targetNode: Node = null;

    private curvePoints: Vec2[] = [
        v2(0, 80),  // Start point
    v2(600, 415),  // Control point
        v2(15, 711),  // End point
    ];
    private elapsedTime: number = 0;
    private duration: number = 3;  // Total time to complete the curve (in seconds)

    start() {
        // Create the sprite
        const sprite = this.targetNode.addComponent(Sprite);
        // Set the sprite's image or texture
        
        // Schedule update function
        this.schedule(this.updateBezierCurve, 0.02);
    }

    updateBezierCurve(dt: number) {
        this.elapsedTime += dt;
        const t = this.elapsedTime / this.duration;

        // Calculate the position on the Bezier curve using the curve equation
        const p0 = this.curvePoints[0];
        const p1 = this.curvePoints[1];
        const p2 = this.curvePoints[2];
        let position =   this.calculateBezierPoint(p0, p1, p2, t);

        // Update the sprite's position
        this.targetNode.setPosition(new Vec3(position.x,position.y,0));

        // If the curve animation is completed, unschedule the update function
        if (t >= 1) {
            this.unschedule(this.updateBezierCurve);
        }
    }

    calculateBezierPoint(p0:  Vec2, p1:  Vec2, p2:  Vec2, t: number):  Vec2 {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;

        const p =  v2(0, 0);
        p.x = uu * p0.x + 2 * u * t * p1.x + tt * p2.x;
        p.y = uu * p0.y + 2 * u * t * p1.y + tt * p2.y;

        return p;
    }
}
