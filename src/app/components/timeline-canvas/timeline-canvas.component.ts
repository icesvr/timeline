import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timeline-canvas',
  templateUrl: './timeline-canvas.component.html',
  styleUrls: ['./timeline-canvas.component.scss']
})
export class TimelineCanvasComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private lineCount = 10;
  private hoursPerPage = 24;
  private canvasWidth = window.innerWidth;
  private position = 0;


  
  private cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }
  private cameraZoom = 0.5
  private MAX_ZOOM = 5
  private MIN_ZOOM = 1
  private SCROLL_SENSITIVITY = 0.0005
  private isDragging = false
  private dragStart = { x: 0, y: 0 }
  private initialPinchDistance = null
  private lastZoom = this.cameraZoom;

  constructor(private render:Renderer2){
    
  }


  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    // this.canvasRef.nativeElement.width = window.innerWidth; //antes
    // this.canvasRef.nativeElement.style.width = "100%"
    // this.canvasRef.nativeElement.style.height = "100%"
    // this.canvasRef.nativeElement.width = this.canvasRef.nativeElement.offsetWidth;
    // this.canvasRef.nativeElement.height = this.canvasRef.nativeElement.offsetHeight;
    //this.drawTimeline(1,this.hoursPerPage);
    //this.drawTimeline(1,this.hoursPerPage)

    this.canvasRef.nativeElement.addEventListener( 'wheel', (e:any) => {
      this.adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY)
      console.log(e);
    })

    this.drawTimeline();
    this.render.listen('window', 'scroll', () => {
      this.drawTimeline();
    });
    // this.drawVerticalLine();

    // this.circle(383)
   // console.log(window.innerWidth);

    this.canvasRef.nativeElement.addEventListener('resize', () => {
      this.canvasRef.nativeElement.width = window.innerWidth;
      console.log(window.innerWidth);
  });


  }
  
  

  // drawTimeline(eventTime:number, hours:number) {
  //   const now = new Date(); // Obtener la fecha actual
  //   console.log(this.canvasWidth);
  //   // Número de horas que deseas mostrar en el timeline
  //   //const pixelsPerHour = 30; // Cantidad de píxeles por hora en el timeline
  //   const pixelsPerHour = this.canvasWidth / hours;
  //   console.log(pixelsPerHour);
  //   // Calcular la posición del punto inicial del timeline
  //   const startX = this.ctx.canvas.width - hours * pixelsPerHour;
  //   console.log('CANVAS WIDTTH: ',this.ctx.canvas.width );
  //   console.log('STARTTX: ',startX );
  //   const startY = this.ctx.canvas.height / 2;
  
  //   this.ctx.strokeStyle = 'green';
  //   this.ctx.lineWidth = 2;
  
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(0, startY);
  //   this.ctx.lineTo(window.innerWidth, startY);
  //   this.ctx.lineTo(0, startY);
  //   this.ctx.stroke();
  
  //   // Dibujar los eventos en el timeline
  //   // Aquí puedes agregar lógica para obtener los eventos desde tu fuente de datos
  //   const cordenadas = []
  //   // Por ejemplo, dibujar un evento cada 2 horas
  //   for (let i = 0; i <= hours; i += eventTime) {
  //     //const x = startX + i * pixelsPerHour;
  //     const x = 15 + i * pixelsPerHour;
  //     this.ctx.beginPath();
  //     this.ctx.moveTo(i * pixelsPerHour, startY - 10);
  //     this.ctx.lineTo(i * pixelsPerHour, startY + 10);
  //     this.ctx.stroke();
  
  //     // Mostrar la hora del evento
  //     const eventTime = new Date(now.getTime() - i * 60 * 60 * 1000);
  //     const timeText = eventTime.getHours() + ':00';
     
  //     console.log('timetext: ',timeText, 'X: ',i * pixelsPerHour, 'i: ',i);
  //     cordenadas.push({time:eventTime, x:i * pixelsPerHour})
  //     this.ctx.fillText(timeText, i * pixelsPerHour, startY + 25);
  //   }

  //   console.log('Cordenadas: ',cordenadas);
  //   const eventHour = 11;
  //   const eventMinutes = 0;
  //   console.log('aaa: ',(eventHour + eventMinutes / 60) * (pixelsPerHour));
  //   const eventTimeX = 15 + (eventHour + eventMinutes / 60) * pixelsPerHour; //ESTE VALOR ES EL QUE DEJA EL EVENTO EN LA POSICION CORRECTA
  //   const eventTimeY = 50;
  //   console.log('EVENTx: ',eventTimeX);
  //   // Dibujar el círculo verde del evento
  //   this.ctx.fillStyle = 'red';
  //   this.ctx.beginPath();
  //   this.ctx.arc(eventTimeX , eventTimeY, 10, 0, Math.PI * 2); //+15
  //   this.ctx.fill();

  //   // this.ctx.fillStyle = 'green';
  //   // this.ctx.beginPath();
  //   // this.ctx.arc(eventTimeX, eventTimeY, 10, 0, Math.PI * 2);
  //   // this.ctx.fill();

  //   // Mostrar la hora del evento
  //   // const eventTimeText = `${eventHour}:${eventMinutes < 10 ? '0' + eventMinutes : eventMinutes}`;
  //   // this.ctx.fillText(eventTimeText, eventTimeX - 15, eventTimeY + 25);

  // }
  
  drawTimeline() {

    this.canvasRef.nativeElement.width = window.innerWidth
    this.canvasRef.nativeElement.height = window.innerHeight
   
    this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
    this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    

    const now = new Date(); // Obtener la fecha actual
  
    const hours = 24; // Número de horas que deseas mostrar en el timeline
    const pixelsPerHour = this.ctx.canvas.width / hours; // Cantidad de píxeles por hora en el timeline
  
    // Calcular la posición del punto inicial del timeline
    const startX = this.ctx.canvas.width - hours * pixelsPerHour;
    const startY = this.ctx.canvas.height / 2;
  
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
  
    this.ctx.beginPath();
    this.ctx.moveTo(0, startY);
    this.ctx.lineTo(window.innerWidth, startY);
    this.ctx.lineTo(this.ctx.canvas.width, startY);
    this.ctx.stroke();
  
    // Dibujar los eventos en el timeline
    // Aquí puedes agregar lógica para obtener los eventos desde tu fuente de datos
  
    // Por ejemplo, dibujar un evento cada 2 horas
    for (let i = 0; i <= hours; i += 1) {
      const x = startX + i * pixelsPerHour;
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY - 10);
      this.ctx.lineTo(x, startY + 10);
      this.ctx.stroke();
      console.log(i, x);  
      // Mostrar la hora del evento
      const eventTime = new Date(now.getTime() - i * 60 * 60 * 1000);
      const timeText = eventTime.getHours() + ':00';
      this.ctx.fillText(timeText, x - 15, startY + 25);
    }

     // Dibujar los eventos en el timeline
    // Por ejemplo, dibujar un evento a las 12:30 (media hora después de las 12:00)
    const eventHour = 12;
    const eventMinutes = 30;
    const eventTimeX = startX + (eventHour + eventMinutes / 60) * pixelsPerHour;
    const eventTimeY = 50;
    console.log(eventTimeX);
    // Dibujar el círculo verde del evento
    this.ctx.fillStyle = 'green';
    this.ctx.beginPath();
    this.ctx.arc(eventTimeX, eventTimeY, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Mostrar la hora del evento
    const eventTimeText = `${eventHour}:${eventMinutes < 10 ? '0' + eventMinutes : eventMinutes}`;
    this.ctx.fillText(eventTimeText, eventTimeX - 15, eventTimeY + 25);
    window.requestAnimationFrame( () => this.drawTimeline );
  }
  

  verticalLine(position:number){
    this.ctx.beginPath();
    this.ctx.moveTo(position, 30);
    this.ctx.lineTo(position, 70);
    this.ctx.stroke();
    this.ctx.closePath()
  }

  circle(position:number){
    console.log('laposition: ',position);
    this.ctx.beginPath();
    this.ctx.arc(position, 15, 10,0, 2 * Math.PI, false)
    this.ctx.fillStyle = 'black'
    this.ctx.fill();
    this.ctx.stroke();
  }

  zoom(type: 'in' | 'out'){
    console.log(type);
    if(type==='in'){
      this.hoursPerPage = (this.hoursPerPage==0 || this.hoursPerPage<0) ? this.hoursPerPage = 4 : this.hoursPerPage-4
      this.ctx.clearRect(0,0, this.ctx.canvas.width,this.ctx.canvas.height)
      console.log(this.hoursPerPage );
    //  this.drawTimeline(1,   this.hoursPerPage)
    // this.drawTimeline(1,   this.hoursPerPage)
    }else{
      this.lineCount = (this.lineCount==24) ? this.lineCount = 24 : this.lineCount-10;
      console.log('LINEEE: ',this.lineCount );
      
    }
  }

  adjustZoom(zoomAmount:any, zoomFactor?:any)
  {
    if (!this.isDragging)
    {
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


}
