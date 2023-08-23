import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Event } from './event';

interface Location{
  x:number
  y:number
}

interface lineDay{
  date: string;
  position:number,
  info:string
}

@Component({
  selector: 'app-timeline-scale',
  templateUrl: './timeline-scale.component.html',
  styleUrls: ['./timeline-scale.component.scss']
})
export class TimelineScaleComponent {
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
  timeStampList:any[];
  dateList:any[];
  startX:number = 0;
  startY:number = 0;
  startSize:number=window.innerWidth;
  constructor(private render:Renderer2){
    
    this.timeStampList = [
      {timestamp:1691717294},
      {timestamp:1691719094},
      {timestamp:1691715494}    
    ]
    
    this.dateList = [
      { date: new Date(), startPosition:0 }
    ]
    
  }

  ngOnInit():void{
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    //console.log('TAMAÑO FULL: ',this.startSize);
    
    
    this.canvasEvent();
    
    
    //console.log('aaaaaa',this.startY);
    
    //bien
    this.timeLine();
    console.log('startXXXX 0nInit: ',this.startX);
    //console.log('vvvbbbb',this.startY);
    this.line(this.startY,)
    this.line(this.startY,-window.innerWidth)
    // this.ctx.strokeStyle = 'red';
    // this.ctx.lineWidth = 2;
  
    // this.ctx.beginPath();
    // this.ctx.moveTo(this.startX, this.startY);
    // this.ctx.lineTo(window.innerWidth, this.startY);
    // this.ctx.lineTo(this.ctx.canvas.width, this.startY);
    // this.ctx.stroke();
    //APITIMELINEPARAMS(fecha(tiempo relativo,timestamp),zoomLevel)
    //drawRenderTimeline(Response de la api)
    //-Linea de tiempo (Cantidad de horas??'', )
    //-eventos(array de eventos con TIMESTAMP**)
    //-interacciones(listener(features extras)) <- podria ser una constante

  }

  draw(){
    this.canvasRef.nativeElement.width = window.innerWidth
    this.canvasRef.nativeElement.height = window.innerHeight

    this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
    this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
    this.ctx.fillRect( 0, 0, 100, 100 )

    // this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    // this.ctx.fillRect( 0, 0, 100, 100 )
    // this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    // this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
    console.log('EN DRAW');
    window.requestAnimationFrame( () => this.draw );
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
      this.timeLine()
      this.line(this.startY )
    });

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

  timeLine():void{
    this.canvasRef.nativeElement.width = window.innerWidth
    this.canvasRef.nativeElement.height = window.innerHeight
    this.startX = this.ctx.canvas.width ;
    this.startY = this.ctx.canvas.height / 2;
    //this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    //console.log('startXXXX timeline: ',this.startX);
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
  
    this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

    const now = new Date(); // Obtener la fecha actual
  
    const hours = 24; // Número de horas que deseas mostrar en el timeline
    const pixelsPerHour = this.ctx.canvas.width / hours; // Cantidad de píxeles por hora en el timeline
  
    // Calcular la posición del punto inicial del timeline
    const startX = this.ctx.canvas.width - hours * pixelsPerHour;
    const startY = this.ctx.canvas.height / 2;
    //console.log('estart: ',startX);
  

    //this.line(startY)
    let innerWidth = -window.innerWidth
    //console.log('INNERWIDTHÑ ',-window.innerWidth);
    //this.line(startY,-window.innerWidth)
    // this.line(startY-20 -window.innerWidth*1 + 300)
   
    // this.line(startY-20, -window.innerWidth*1 + 30)

    // this.ctx.strokeStyle = 'green';
    // this.ctx.lineWidth = 2;
    // this.ctx.beginPath();
    // this.ctx.moveTo(-startX*2-20, startY-20);
    // this.ctx.lineTo(-window.innerWidth , startY-20);
    // this.ctx.lineTo(-this.ctx.canvas.width, startY-20);
    // this.ctx.stroke();

   

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

    this.drawEvent(startX, pixelsPerHour)
   
    window.requestAnimationFrame( () => this.timeLine );
  }


  drawEvent(startX:number, pixelsPerHour:any):void{
    
    this.timeStampList.map((data,i) => {
      const date = new Date(data?.timestamp * 1000);
      const hour = date.getHours();
      //console.log(hour);
      const min = date.getMinutes();
       const eventTimeX =   (1+hour + min / 60) * pixelsPerHour; //eventTimeX =   (1+hour + min / 60) * pixelsPerHour;
       //console.log('eventoTime: ',eventTimeX);
        const eventTimeY = 50;

        const event = new Event(eventTimeX,(window.innerHeight / 2), -20,100);
        //console.log(event);
        event.drawEvent(this.ctx)
        // Dibujar el círculo verde del evento
        // this.ctx.fillStyle = 'red';
        // this.ctx.beginPath();
        // this.ctx.arc(eventTimeX, (window.innerHeight / 2) -20, 5, 0, Math.PI * 2);
        // this.ctx.fill();

        // Mostrar la hora del evento
        const eventTimeText = `${hour}:${min < 10 ? '0' + min : min}`;
        //this.ctx.fillText(eventTimeText, eventTimeX - 15, (window.innerHeight / 2) -30);
       
        this.timeStampList[i].x = eventTimeX;
      

    });
    //console.log(this.timeStampList);
    // const eventHour = 3
    // const eventMin = 30;

    // const eventTimeX =   (1+eventHour + eventMin / 60) * pixelsPerHour;
    // const eventTimeY = 50;

    // // Dibujar el círculo verde del evento
    // this.ctx.fillStyle = 'green';
    // this.ctx.beginPath();
    // this.ctx.arc(eventTimeX, (window.innerHeight / 2) -20, 5, 0, Math.PI * 2);
    // this.ctx.fill();

    // // Mostrar la hora del evento
    // const eventTimeText = `${eventHour}:${eventMin < 10 ? '0' + eventMin : eventMin}`;
    // this.ctx.fillText(eventTimeText, eventTimeX - 15, (window.innerHeight / 2) -30);
  }

  newEvent(startX:number, pixelsPerHour:any):void{

  }

  line(startY:number,startX:number=0):void{
    //console.log('comienza en : ', startX);
    
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
  
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(window.innerWidth, startY);
    this.ctx.lineTo(this.ctx.canvas.width, startY);
    this.ctx.stroke();
  }

  timeLine2():void{
    this.canvasRef.nativeElement.width = window.innerWidth
    this.canvasRef.nativeElement.height = window.innerHeight
    //this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
    this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

    const now = new Date(); // Obtener la fecha actual
  
    const hours = 24; // Número de horas que deseas mostrar en el timeline
    const pixelsPerHour = this.ctx.canvas.width / hours; // Cantidad de píxeles por hora en el timeline
  
    // Calcular la posición del punto inicial del timeline
    const startX = this.ctx.canvas.width - hours * pixelsPerHour;
    const startY = 100;
  
    this.line(startY)

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

    this.drawEvent(startX, pixelsPerHour)

    window.requestAnimationFrame( () => this.timeLine2 );
  }


}
