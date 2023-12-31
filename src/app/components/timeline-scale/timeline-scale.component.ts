import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Event } from './event';

interface Location{
  x:number
  y:number
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
  constructor(private render:Renderer2){
    this.timeStampList = [
      {timestamp:1691717294},
      {timestamp:1691719094},
      {timestamp:1691715494}    
    ]
    
  }

  ngOnInit():void{
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    this.canvasEvent();




    //bien
    this.timeLine();
    
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
    });

    this.canvasRef.nativeElement.addEventListener('mousemove', (e:any) => {
      if (this.isDragging){
        this.cameraOffset.x = this.getLocation(e).x/1 - this.dragStart.x
        console.log(this.cameraOffset.x);
        this.cameraOffset.y = this.getLocation(e).y/1 - this.dragStart.y
        // this.draw()
        this.timeLine()
      }  
    })

    this.canvasRef.nativeElement.addEventListener('mousedown', (e:any) => {
      this.isDragging = true    
      this.dragStart.x = this.getLocation(e).x/1 - this.cameraOffset.x
      this.dragStart.y = this.getLocation(e).y/1 - this.cameraOffset.y
    })

    this.canvasRef.nativeElement.addEventListener('mouseup', (e:any) => {
      
      this.isDragging = false
      // console.log(this.isDragging );
      // // isDragging = false
      // // initialPinchDistance = null
      // // lastZoom = cameraZoom
    })

    this.canvasRef.nativeElement.addEventListener( 'wheel', (e:any) => {
      this.adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY)
      this.timeLine()
    })

    this.canvasRef.nativeElement.addEventListener( 'click', (e:any) => {
      this.cameraOffset.x = this.getLocation(e).x/1 - this.dragStart.x
        console.log(this.cameraOffset.x);
      // console.log('su click: ',e);
      // alert(e)
    })

  }

  timeLine():void{
    this.canvasRef.nativeElement.width = window.innerWidth
    this.canvasRef.nativeElement.height = window.innerHeight
    //this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    console.log('WI: ',-window.innerWidth);
    console.log('off;: ',this.cameraOffset.x);
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
    this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

    const now = new Date(); // Obtener la fecha actual
  
    const hours = 24; // Número de horas que deseas mostrar en el timeline
    const pixelsPerHour = this.ctx.canvas.width / hours; // Cantidad de píxeles por hora en el timeline
  
    // Calcular la posición del punto inicial del timeline
    const startX = this.ctx.canvas.width - hours * pixelsPerHour;
    const startY = this.ctx.canvas.height / 2;
  
    this.line(startY)
    //this.line(startY,window.innerWidth)
    let innerWidth = -window.innerWidth
    //console.log('INNERWIDTHÑ ',-window.innerWidth);
    //this.line(startY,-window.innerWidth)
    this.line(startY,-window.innerWidth*1)
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
        event.draw(this.ctx)
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
    
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
  
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(window.innerWidth, startY);
    this.ctx.lineTo(this.ctx.canvas.width, startY);
    this.ctx.stroke();
  }




}
