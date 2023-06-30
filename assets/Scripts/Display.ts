import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Display')
export class Display extends Component {
    
  

    @property({
    type: Label
    })
    public label1: Label;
 
    @property({
    type: Label
    })
    public label2: Label;
 
    @property({
    type: Label
    })
    public label3: Label;

    @property({
        type: Label
        })
    public label4: Label;

    @property({
        type: Label
        })
    public label5: Label;

    @property({
        type: Label
        })
    public label6: Label;
    @property({
        type: Label
        })
    public background: Label;

    static mensaje:string;
    static interval:number=0;


     
    public static print(contenido:string){
        Display.mensaje=contenido;
        Display.interval=0;
        

    }


  
    update(dt) {
        Display.interval+=dt
        if(Display.interval>1) {
            Display.interval=0;
            Display.mensaje="..."
        }
        this.background.string = Display.mensaje;
    }

    public showInDisplay(slot:number, contenido:string) {
 
        switch(slot) {
            case 1: {
            
                this.label1.string = contenido;
                break;
           
            }
            case 2: {
                this.label2.string = contenido;
                break;
           
            }
        
            case 3: {
                this.label3.string = contenido;
                break;
           
            }
            case 4: {
                this.label4.string = contenido;
                break;
           
            }
            case 5: {
                this.label5.string = contenido;
                break;
           
            }
            case 6: {
                this.label6.string = contenido;
                break;
           
            }
      
        }
        
    }

 
}


