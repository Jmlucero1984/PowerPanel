
import { _decorator, Component, Node } from 'cc';
import { SuperGraphics } from './SuperGraphics';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = g2DTest
 * DateTime = Fri Feb 18 2022 11:14:17 GMT+0800 (中国标准时间)
 * Author = 雨到了1分享
 * FileBasename = g2DTest.ts
 * FileBasenameNoExtension = g2DTest
 * URL = db://assets/graphics2D/script/g2DTest.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('g2DTest')
export class g2DTest extends Component {
    @property(SuperGraphics)
    ctx:SuperGraphics = null;

    onLoad() {
        this.ctx = this.getComponent(SuperGraphics);
    }

    start () {
        this.ctx.lineWidth=15;
        this.ctx.moveTo(-100,-100);
        this.ctx.lineTo(-100,100);
        this.ctx.lineTo(100,100);
        this.ctx.lineTo(100,-100);
        this.ctx.lineTo(-100,-100);
        // this.ctx.close();
        this.ctx.stroke();
       // this.ctx.fill();
        
    }

    
}

