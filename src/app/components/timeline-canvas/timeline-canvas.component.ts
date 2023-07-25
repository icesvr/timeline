import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timeline-canvas',
  templateUrl: './timeline-canvas.component.html',
  styleUrls: ['./timeline-canvas.component.scss']
})
export class TimelineCanvasComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private lineCount = 10;
  private canvasWidth = window.innerWidth;
  private position = 0;
  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    console.log(this.canvasRef.nativeElement);
    this.canvasRef.nativeElement.width = window.innerWidth;
   
   
    
    this.drawTimeline();

    // this.drawVerticalLine();

    // this.circle(383)
    console.log(window.innerWidth);

    this.canvasRef.nativeElement.addEventListener('resize', () => {
      this.canvasRef.nativeElement.width = window.innerWidth;
      console.log(window.innerWidth);
  });


  }

  drawVerticalLine(){
    let spaceBetween = 0;
    console.log('linecount: ',this.lineCount);
    console.log('canvas width: ',this.canvasWidth);
    this.position = this.canvasWidth/this.lineCount;
    
    
    for(let i=0; i<this.lineCount; i++){
      this.verticalLine(spaceBetween+this.position);
      spaceBetween = spaceBetween+this.position;
      
    }
  }

  // drawTimeline() {
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(0, 50);
  //   this.ctx.lineTo(window.innerWidth, 50);
  //   this.ctx.lineTo(0, 50);
  //   this.ctx.strokeStyle = 'black';
  //   this.ctx.lineWidth = 2;
  //   this.ctx.stroke();
  // }

  drawTimeline() {
    const now = new Date(); // Obtener la fecha actual
  
    const hours = 24; // Número de horas que deseas mostrar en el timeline
    //const pixelsPerHour = 30; // Cantidad de píxeles por hora en el timeline
    const pixelsPerHour = this.canvasWidth / hours;
    // Calcular la posición del punto inicial del timeline
    const startX = this.ctx.canvas.width - hours * pixelsPerHour;
    const startY = this.ctx.canvas.height / 2;
  
    this.ctx.strokeStyle = 'green';
    this.ctx.lineWidth = 2;
  
    this.ctx.beginPath();
    this.ctx.moveTo(0, startY);
    this.ctx.lineTo(window.innerWidth, startY);
    this.ctx.lineTo(0, startY);
    this.ctx.stroke();
  
    // Dibujar los eventos en el timeline
    // Aquí puedes agregar lógica para obtener los eventos desde tu fuente de datos
  
    // Por ejemplo, dibujar un evento cada 2 horas
    for (let i = 0; i <= hours; i += 1) {
      const x = 15 + i * pixelsPerHour;
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY - 10);
      this.ctx.lineTo(x, startY + 10);
      this.ctx.stroke();
  
      // Mostrar la hora del evento
      const eventTime = new Date(now.getTime() - i * 60 * 60 * 1000);
      const timeText = eventTime.getHours() + ':00';
      this.ctx.fillText(timeText, x - 15, startY + 25);
    }
  }
  

  verticalLine(position:number){
    this.ctx.beginPath();
    this.ctx.moveTo(position, 30);
    this.ctx.lineTo(position, 70);
    this.ctx.stroke();
    this.ctx.closePath()
  }

  circle(position:number){
    this.ctx.beginPath();
    this.ctx.arc(position, 15, 10,0, 2 * Math.PI, false)
    this.ctx.fillStyle = 'black'
    this.ctx.fill();
    this.ctx.stroke();
  }

  zoom(type: 'in' | 'out'){
    console.log(type);
    if(type==='in'){
      this.lineCount = this.lineCount+10;
      console.log('LINEEE: ',this.lineCount );
      this.drawVerticalLine()
    }else{
      this.lineCount = (this.lineCount==0) ? this.lineCount = 0 : this.lineCount-10;
      console.log('LINEEE: ',this.lineCount );
      this.drawVerticalLine()
    }
  }


}
