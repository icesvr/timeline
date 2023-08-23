export class TimeLine{
    start=0
    cwidh:number=0
    color='red'
    txt:string='';
    constructor(x:number, y:number, radius:number, color:number){
        this.x = x;
        this.y = y;
        this.radius= radius;
        this.color=color;
    }

    drawLine(ctx:any, startY:number,startX:number=0, color:string){
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
      
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(window.innerWidth, startY);
        ctx.lineTo(ctx.canvas.width, startY);
        ctx.stroke();
    }


    drawEvent(ctx:any){
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y -20, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    clickEvent(){
        console.log('Selected Event');
    }

}