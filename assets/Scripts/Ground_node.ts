import { _decorator, Canvas, Component, director, Label, Node, SliderComponent, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { GameCtrl } from './GameCtrl';

@ccclass('Ground_Node')
export class Ground_Node extends Component {
 

   @property({
    type: Label,
    tooltip: 'Velocidad'
   })
   public velLabel: Label;

   @property({
    type: SliderComponent
   })
   public slider: SliderComponent;


   // Create ground witdh variables
   public groundWidth1:number;
   public groundWidth2:number;
   public groundWidth3:number;
   // in thre point the position is read only

   public tempStartLocation1 = new Vec3; // Vec3 is an API
   // Even if we are not using the z axis
   public tempStartLocation2 = new Vec3;
   public tempStartLocation3 = new Vec3;

  
   public gameSpeed: number;

   // Just the first and only time app is starting
   onLoad() {
    this.startUp()
   }
   startUp() {
    //this.groundWidth1 = this.ground1.getComponent(UITransform).width;
   // this.groundWidth2 = this.ground2.getComponent(UITransform).width;
    //this.groundWidth3 = this.ground3.getComponent(UITransform).width;

    this.tempStartLocation1.x = 0;
    this.tempStartLocation2.x = this.groundWidth1;
    this.tempStartLocation3.x = this.groundWidth1 + this.groundWidth2;

   //// this.ground1.setPosition(this.tempStartLocation1);
  //  this.ground2.setPosition(this.tempStartLocation2);
  //  this.ground3.setPosition(this.tempStartLocation3);

   }

/*
    update(deltaTime: number) {
        this.gameSpeed = 500*this.slider.progress;
        this.velLabel.string= ""+ this.gameSpeed;

        this.gameSpeed= this.gameSpeed;
        //this.tempStartLocation1 = this.ground1.position;
       // this.tempStartLocation2 = this.ground2.position;
        //this.tempStartLocation3 = this.ground3.position;
        // Get the speed and subtract from x
        this.tempStartLocation1.x -= this.gameSpeed * deltaTime;
        this.tempStartLocation2.x -= this.gameSpeed * deltaTime;
        this.tempStartLocation3.x -= this.gameSpeed * deltaTime;


        const scene = director.getScene();
        const canvas = scene.getComponentInChildren(Canvas);
        
        
        if(this.tempStartLocation1.x<=(0-this.groundWidth1)) {
            this.tempStartLocation1.x=canvas.getComponent(UITransform).width;
        }
        if(this.tempStartLocation2.x<=(0-this.groundWidth2)) {
            this.tempStartLocation2.x=canvas.getComponent(UITransform).width;
        }

        if(this.tempStartLocation3.x<=(0-this.groundWidth3)) {
            this.tempStartLocation3.x=canvas.getComponent(UITransform).width;
        }


       // this.ground1.setPosition(this.tempStartLocation1);
      //  this.ground2.setPosition(this.tempStartLocation2);
        //this.ground3.setPosition(this.tempStartLocation3);

    }*/
}


