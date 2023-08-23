import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
interface Location{
  x:number
  y:number
}

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class OlaTimeComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }
  cameraZoom = 1

  MAX_ZOOM = 5
  MIN_ZOOM = 0.9
  SCROLL_SENSITIVITY = 0.0005
  private isDragging = false
  private dragStart:Location = { x: 0, y: 0 }
  lastZoom = this.cameraZoom
  startX:number = 0;
  startY:number = 0;

  constructor(private render:Renderer2){
   
  }

  ngOnInit(){
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.canvasEvent()
  }

  ngAfterViewInit() {
    
    this.adjustCanvasSize(); 
    //this.timeLine();
    this.timeLine2(0,window.innerWidth,'red','Principal');
    
  }

  adjustCanvasSize() {
    // const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    // canvas.width = window.innerWidth; // Establecer el ancho del canvas al ancho de la ventana
    // canvas.height = window.innerHeight; // Establecer la altura del canvas a la altura de la ventana

    this.canvasRef.nativeElement.width = window.innerWidth
    this.canvasRef.nativeElement.height = window.innerHeight
    this.startX = this.ctx.canvas.width ;
    this.startY = this.ctx.canvas.height / 2;
  }

  timeLine(_startXs:number=0) {
    // this.canvasRef.nativeElement.width = window.innerWidth
    // this.canvasRef.nativeElement.height = window.innerHeight
    // this.startX = this.ctx.canvas.width ;
    // this.startY = this.ctx.canvas.height / 2;
    //this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    //console.log('startXXXX timeline: ',this.startX);
    this.adjustCanvasSize()
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
  
    this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

    const now = new Date(); // Obtener la fecha actual
  
    const hours = 24; // Número de horas que deseas mostrar en el timeline
    const pixelsPerHour = this.ctx.canvas.width / hours; // Cantidad de píxeles por hora en el timeline
  
    // Calcular la posición del punto inicial del timeline
    const startX = this.ctx.canvas.width - hours * pixelsPerHour;
    const startY = this.ctx.canvas.height / 2;
    this.line(startY,0, 'red')
    for (let i = hours; i >= 0; i -= 1) {
      const x = startX + i * pixelsPerHour;
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY - 10);
      this.ctx.lineTo(x, startY + 10);
      this.ctx.stroke();
      
      // Mostrar la hora del evento
      const eventTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      //console.log('aaa: ',eventTime.getHours());
      const timeText = eventTime.getHours() + ':00';
      this.ctx.fillText(timeText, x - 15, startY + 25);
    }

    //this.drawEvent(startX, pixelsPerHour)
   
    window.requestAnimationFrame( () => this.timeLine );
  }

  timeLine2(start=0, cwidh:number=0, color='red', txt:string) {
    // this.canvasRef.nativeElement.width = window.innerWidth
    // this.canvasRef.nativeElement.height = window.innerHeight
    // this.startX = this.ctx.canvas.width ;
    // this.startY = this.ctx.canvas.height / 2;
    //this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    //console.log('startXXXX timeline: ',this.startX);
    this.adjustCanvasSize()
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
  
    this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

    const now = new Date(); // Obtener la fecha actual
  
    const hours = 24; // Número de horas que deseas mostrar en el timeline
    const pixelsPerHour = this.ctx.canvas.width / hours; // Cantidad de píxeles por hora en el timeline
  
    // Calcular la posición del punto inicial del timeline
    const startX = this.ctx.canvas.width - hours * pixelsPerHour;
    const startY = this.ctx.canvas.height / 2;
    //this.line(startY, 0,'black',this.ctx.canvas.width)
    //this.line(startY, -this.ctx.canvas.width, 'red')
    this.line1(startY)
    //this.line(startY, -this.ctx.canvas.width, 'purple', -this.ctx.canvas.width*3)
    // this.line(startY, -this.ctx.canvas.width, 'yellow', -4000)
    for (let i = hours; i >= 0; i -= 1) {
      const x = startX + i * pixelsPerHour;
  
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY - 10);
      this.ctx.lineTo(x, startY + 10);
      this.ctx.stroke();

      // Mostrar la hora del evento
      const eventTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      //console.log('aaa: ',eventTime.getHours());
      const timeText = eventTime.getHours() + ':00';
      this.ctx.fillText(timeText, x - 15, startY + 25);
      
    }
    this.ctx.fillText(txt,start/2, startY - 200)

    //this.drawEvent(startX, pixelsPerHour)
   
    window.requestAnimationFrame( () => this.timeLine2 );
  }

  
  line1(startY:number,startX:number=0):void{
      //console.log('comienza en : ', startX);
      
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
    
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(window.innerWidth, startY);
      this.ctx.lineTo(this.ctx.canvas.width, startY);
      this.ctx.stroke();
    
  }

  line(startY:number,startX:number=0, color:string='black', test=0):void{
    //console.log(`${color}: `, startX, startY);
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(test, startY);
    this.ctx.lineTo(this.ctx.canvas.width, startY);
    this.ctx.stroke();
  }

  getLocation(e:any){
    //console.log(e);
    const location:Location = { x:0, y:0};
    
    if (e.touches && e.touches.length == 1)
    {
      location.x =  e.touches[0].clientX;
      //location.y =  e.touches[0].clientY;
       
    }
    else if (e.clientX && e.clientY)
    {
      location.x = e.clientX;
      //location.y = e.clientY;
              
    }

    return location;
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
  }

  canvasEvent():void{

    this.render.listen('window', 'scroll', (e) => {
      // this.draw()
      this.adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY)
      //this.timeLine()
      //this.timeLine2();
      //this.line(this.startY )
    });

    this.canvasRef.nativeElement.addEventListener('mousemove', (e:any) => {
      if (this.isDragging){
        
        this.cameraOffset.x = this.getLocation(e).x/1 - this.dragStart.x
        //console.log('OFFSET',this.cameraOffset.x);
        this.cameraOffset.y = this.getLocation(e).y/1 - this.dragStart.y
        //console.log(this.cameraOffset.x );
        console.log(this.startX, this.cameraOffset.x);
        this.timeLine2(-window.innerWidth,window.innerWidth,'green','Secundario');
        this.timeLine2(-window.innerWidth*2,window.innerWidth,'red','Secundario');
        // this.draw()
        //this.timeLine()
        //this.timeLine2(0,-this.ctx.canvas.width,'red');
        // this.timeLine2(-this.ctx.canvas.width,-this.ctx.canvas.width*2,'green');
        // this.timeLine2(-this.ctx.canvas.width,-this.ctx.canvas.width*3,'red');
       
        
        window.requestAnimationFrame( (e) => {
          this.timeLine2
          //this.line
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
      //this.timeLine()
      //this.timeLine2();
      //this.line(this.startY )
      
    })

    this.canvasRef.nativeElement.addEventListener( 'click', (e:any) => {
      this.cameraOffset.x = this.getLocation(e).x/1 - this.dragStart.x
      console.log(e.clientX);

    })

  }

}
