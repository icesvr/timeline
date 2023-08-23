import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { TimeLine } from '../objects/timeline';
interface Location {
  x: number;
  y: number;
}
const SCROLL_SENSITIVITY = 0.0005;

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  cameraZoom = 1;

  MAX_ZOOM = 5;
  MIN_ZOOM = 0.9;
  SCROLL_SENSITIVITY = 0.0005;
  private isDragging = false;
  private dragStart: Location = { x: 0, y: 0 };
  lastZoom = this.cameraZoom;
  startX: number = 0;
  startY: number = 0;

  linea1: any = null;
  linea2: any = null;

  constructor(private render: Renderer2) {}

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
  }

  ngAfterViewInit() {
    this.adjustCanvasSize();
    //this.timeLine();
    //this.timeLine2(0,window.innerWidth,'red','Principal');
    this.startDrawer();
  }
  startDrawer() {
    this.canvasEvent();
    window.requestAnimationFrame(() => {
      this.laDrawer();
    });
  }

  adjustCanvasSize() {
    // const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    // canvas.width = window.innerWidth; // Establecer el ancho del canvas al ancho de la ventana
    // canvas.height = window.innerHeight; // Establecer la altura del canvas a la altura de la ventana

    this.canvasRef.nativeElement.width = window.innerWidth;
    this.canvasRef.nativeElement.height = window.innerHeight;
    this.startX = this.ctx.canvas.width;
    this.startY = this.ctx.canvas.height / 2;
  }

  laDrawer() {
    this.linea1 = new TimeLine(
      this.render,
      this.ctx,
      -window.innerWidth,
      100,
      'cyan'
    );
    this.linea2 = new TimeLine(this.render, this.ctx, 50, 0, 'red');

    window.requestAnimationFrame(() => {
      this.laDrawer();
    });
  }

  getLocation(e: any) {
    //console.log(e);
    const location: Location = { x: 0, y: 0 };

    if (e.touches && e.touches.length == 1) {
      location.x = e.touches[0].clientX;
      //location.y =  e.touches[0].clientY;
    } else if (e.clientX && e.clientY) {
      location.x = e.clientX;
      //location.y = e.clientY;
    }

    return location;
  }

  adjustZoom(zoomAmount: any, zoomFactor?: any) {
    if (!this.isDragging) {
      console.log('not drag');
      if (zoomAmount) {
        this.cameraZoom += zoomAmount;
      } else if (zoomFactor) {
        console.log(zoomFactor);
        this.cameraZoom = zoomFactor * this.lastZoom;
      }

      this.cameraZoom = Math.min(this.cameraZoom, this.MAX_ZOOM);
      this.cameraZoom = Math.max(this.cameraZoom, this.MIN_ZOOM);

      console.log('ZOOM: ', zoomAmount);
    }
  }
  canvasEvent(): void {
    this.render.listen('window', 'scroll', (e) => {
      // this.draw()
      this.adjustZoom(e.deltaY * SCROLL_SENSITIVITY);
      //this.timeLine()
      //this.timeLine2();
      //this.line(this.startY )
      this.linea1.drawLine();
    });
    this.render.listen('window', 'scroll', (e) => {
      // this.draw()
      this.adjustZoom(e.deltaY * SCROLL_SENSITIVITY);
      //this.timeLine()
      this.linea1.drawLine();
    });

    this.canvasRef.nativeElement.addEventListener('mousemove', (e: any) => {
      if (this.isDragging) {
        //this.startDrawer();
        this.linea1.drawLine();
        this.cameraOffset.x = this.getLocation(e).x / 1 - this.dragStart.x;
        //console.log('OFFSET',this.cameraOffset.x);
        this.cameraOffset.y = this.getLocation(e).y / 1 - this.dragStart.y;
        //console.log(this.cameraOffset.x );
        //console.log(this.startX, this.cameraOffset.x);
        // this.timeLine2(-window.innerWidth,window.innerWidth,'green','Secundario');
        // this.timeLine2(-window.innerWidth*2,window.innerWidth,'red','Secundario');
        // this.draw()
        //this.timeLine()
        //this.timeLine2(0,-this.ctx.canvas.width,'red');
        // this.timeLine2(-this.ctx.canvas.width,-this.ctx.canvas.width*2,'green');
        // this.timeLine2(-this.ctx.canvas.width,-this.ctx.canvas.width*3,'red');

        /*    window.requestAnimationFrame( (e) => {
          this.timeLine2
          //this.line
        }); */
      }
    });

    this.canvasRef.nativeElement.addEventListener('mousedown', (e: any) => {
      
      this.isDragging = true;
      this.dragStart.x = this.getLocation(e).x / 1 - this.cameraOffset.x;
      this.dragStart.y = this.getLocation(e).y / 1 - this.cameraOffset.y;
    });

    this.canvasRef.nativeElement.addEventListener('mouseup', (e: any) => {
      this.isDragging = false;
    });

    this.canvasRef.nativeElement.addEventListener('wheel', (e: any) => {
      this.adjustZoom(e.deltaY * this.SCROLL_SENSITIVITY);
      //this.timeLine()
      //this.timeLine2();
      //this.line(this.startY )
    });

    this.canvasRef.nativeElement.addEventListener('click', (e: any) => {
      this.cameraOffset.x = this.getLocation(e).x / 1 - this.dragStart.x;
      console.log(e.clientX);
    });
  }
}
