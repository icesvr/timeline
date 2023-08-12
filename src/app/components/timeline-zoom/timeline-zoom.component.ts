import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timeline-zoom',
  templateUrl: './timeline-zoom.component.html',
  styleUrls: ['./timeline-zoom.component.scss']
})
export class TimelineZoomComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  
  
  cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }
  private cameraZoom = 1
  private MAX_ZOOM = 5
  private MIN_ZOOM = 0.1
  private SCROLL_SENSITIVITY = 0.0005
  private isDragging = false
  private dragStart = { x: 0, y: 0 }
  private initialPinchDistance = null || 0
  private lastZoom = this.cameraZoom;


  constructor(private render:Renderer2){
    
    console.log(this.cameraOffset);
    this.cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 }
    
  }

  ngOnInit(){
    
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');

    
    
    
    this.draw();

    this.render.listen('window', 'scroll', () => {
      this.draw()
    });




    this.canvasRef.nativeElement.addEventListener('touchmove', (e:any) => {
      // console.log('aaa debtri-,: ',e);
      // this.handleTouch(e, this.onPointerMove)
      console.log('EE');
    })
    this.canvasRef.nativeElement.addEventListener( 'wheel', (e:any) => {
      this.adjustZoom(e.deltaY*this.SCROLL_SENSITIVITY)
      console.log('adasdasdasdasda');
    })

    this.canvasRef.nativeElement.addEventListener('mousedown', (e:any) => {
      
      this.isDragging = true
      console.log(this.isDragging );
      this.dragStart.x = this.getEventLocation(e).x/this.cameraZoom - this.cameraOffset.x
      this.dragStart.y = this.getEventLocation(e).y/this.cameraZoom - this.cameraOffset.y
      console.log(this.dragStart);
    })

    this.canvasRef.nativeElement.addEventListener('mousemove', (e:any) => {
      console.log('eeeerer');
      if (this.isDragging){
        this.cameraOffset.x = this.getEventLocation(e).x/this.cameraZoom - this.dragStart.x
        this.cameraOffset.y = this.getEventLocation(e).y/this.cameraZoom - this.dragStart.y
      }
      
    })

    this.canvasRef.nativeElement.addEventListener('mouseup', () => {
      console.log('salee');
      this.isDragging = false
      this.initialPinchDistance = 0
      this.lastZoom = this.cameraZoom
      console.log(this.lastZoom );
    })
  }

  draw(): void {
    this.canvasRef.nativeElement.width = window.innerWidth
    this.canvasRef.nativeElement.height = window.innerHeight
    
    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    this.ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    this.ctx.scale(this.cameraZoom, this.cameraZoom)
    this.ctx.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
    this.ctx.fillStyle = "#991111"
    this.drawRect(-50,-50,100,100)
    
    this.ctx.fillStyle = "#eecc77"
    this.drawRect(-35,-35,20,20)
    this.drawRect(15,-35,20,20)
    this.drawRect(-35,15,70,20)
    
    this.ctx.fillStyle = "#fff"
    this.drawText("Simple Pan and Zoom Canvas", -255, -100, 32, "courier")
    
    this.ctx.rotate(-31*Math.PI / 180)
    this.ctx.fillStyle = `#${(Math.round(Date.now()/40)%4096).toString(16)}`
    this.drawText("Now with touch!", -110, 100, 32, "courier")
    
    this.ctx.fillStyle = "#fff"
    this.ctx.rotate(31*Math.PI / 180)
    
    this.drawText("Wow, you found me!", -260, -2000, 48, "courier")
    
    window.requestAnimationFrame( () => this.draw );
  }
 
  drawRect(x:number, y:number, width:number, height:number){
      this.ctx.fillRect( x, y, width, height )
  }

  drawText(text:string, x:number, y:number, size:number, font:string){
    this.ctx.font = `${size}px ${font}`
    this.ctx.fillText(text, x, y)
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
  
  getEventLocation(e:any){
    let obj = {x:0, y:0}
    if (e.clientX && e.clientY)
      {
        obj = { x: e.clientX, y: e.clientY }        
      }

      return obj
  }

  onPointerMove(e:Event){
    
    if (this.isDragging){
      this.cameraOffset.x = this.getEventLocation(e).x/this.cameraZoom - this.dragStart.x
      this.cameraOffset.y = this.getEventLocation(e).y/this.cameraZoom - this.dragStart.y
    }
  }

  handleTouch(e:any, singleTouchHandler:any){
    console.log(singleTouchHandler);
      if ( e.touches.length == 1 )
      {
          singleTouchHandler(e)
      }
      else if (e.type == "touchmove" && e.touches.length == 2)
      {
          this.isDragging = false
          this.handlePinch(e)
      }
  }

  handlePinch(e:any){
    e.preventDefault()
    
    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
    
    if (this.initialPinchDistance == null)
    {
      this.initialPinchDistance = currentDistance
    }
    else
    {
      this.adjustZoom( null, currentDistance/this.initialPinchDistance )
    }
  }

  onPointerDown(e:MouseEvent){
    console.log(this.cameraZoom);
    console.log(this.cameraOffset);
    console.log(window.innerWidth);
    this.isDragging = true
  
    this.dragStart = {
      x :  e.clientX / this.cameraZoom - window.innerWidth/2,
      y : e.clientY / this.cameraZoom - window.innerHeight/2
    }
    console.log(this.dragStart);
  }

  


}
