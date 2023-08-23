const SCROLL_SENSITIVITY = 0.0005;

export class TimeLine{
    start=0
    cwidh:number=0
    txt:string='';
    x=0
    y=0
    ctx:any = null
    render:any = null
    color = ''
    cameraZoom = 0
    isDragging = false
    constructor(render:any,ctx:any,x:number, y:number,color:string){
        this.x = x;
        this.y = y;
        this.ctx = ctx
        this.color=color;
        this.drawLine()

    }

    drawLine(){
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(-1000, this.y);
        this.ctx.lineTo(-100, this.y);
        this.ctx.stroke();

        
    }

    drawEvent(){
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y -20, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }
    clickEvent(){
        console.log('Selected Event');
    }

    

}




/* line(startY:number,startX:number=0):void{
    //console.log('comienza en : ', startX);
    
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
  
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(window.innerWidth, startY);
    this.ctx.lineTo(this.ctx.canvas.width, startY);
    this.ctx.stroke();
  } */
/* 
canvasEvent():void{

   

    this.canvasRef.nativeElement.addEventListener('mousemove', (e:any) => {
      if (this.isDragging){
        
        this.cameraOffset.x = this.getLocation(e).x/1 - this.dragStart.x
        //console.log('OFFSET',this.cameraOffset.x);
        this.cameraOffset.y = this.getLocation(e).y/1 - this.dragStart.y
        //console.log(this.cameraOffset.x );
        console.log(this.startX, this.cameraOffset.x);
        // this.draw()
        this.timeLine()
        //this.line(this.startY )
        this.line(this.startY)
        console.log(typeof this.startX.toFixed(0));
        // if(Number(this.cameraOffset.x.toFixed(0))>Number(this.startX.toFixed(0))){
          
        //   console.log('lo crea acaa');
        //   this.timeLine()
          
          
        //  //console.log(event);
        
        //   this.line(this.startY,-window.innerWidth)
          
        // }
        
        window.requestAnimationFrame( (e) => {
          this.timeLine
          this.line
        });
        

      }  
    })

    this.canvasRef.nativeElement.addEventListener('mousedown', (e:any) => {
      this.isDragging = true    
      this.dragStart.x = this.getLocation(e).x/1 - this.cameraOffset.x
      this.dragStart.y = this.getLocation(e).y/1 - this.cameraOffset.y
    })

    this.canvasRef.nativeElement.addEventListener('mouseup', (e:any) => {
      
      this.isDragging = false

    })

    this.canvasRef.nativeElement.addEventListener( 'wheel', (e:any) => {
      this.adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY)
      this.timeLine()
      this.line(this.startY )
      
    })

    this.canvasRef.nativeElement.addEventListener( 'click', (e:any) => {
      this.cameraOffset.x = this.getLocation(e).x/1 - this.dragStart.x
      //console.log(e.clientX);

    })

  }


  adjustZoom(zoomAmount:any, zoomFactor?:any){
    if (!this.isDragging){
      console.log('not drag');
        if (zoomAmount)
        {
            this.cameraZoom += zoomAmount
        }
        else if (zoomFactor)
        {
            console.log(zoomFactor)
            this.cameraZoom = zoomFactor*this.lastZoom
        }
        
        this.cameraZoom = Math.min( this.cameraZoom, this.MAX_ZOOM )
        this.cameraZoom = Math.max( this.cameraZoom, this.MIN_ZOOM )
        
        console.log('ZOOM: ',zoomAmount)
    }
  } */