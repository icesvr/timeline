export class Event{
    x;
    y;
    radius;
    color;
    constructor(x:number, y:number, radius:number, color:number){
        this.x = x;
        this.y = y;
        this.radius= radius;
        this.color=color;
    }


    draw(ctx:any){
        
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y -20, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    clickEvent(){
        console.log('Selected Event');
    }

}