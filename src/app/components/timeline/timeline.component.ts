import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @ViewChild('pixiContainer', { static: true }) pixiContainer!: ElementRef;

  private app!: PIXI.Application;
  private background!: PIXI.Graphics;
  private timeline: PIXI.Graphics | undefined;
  private timelineLength: number = 600;
  private line!: PIXI.Graphics;
  ngOnInit() {
    this.app = new PIXI.Application({
      width: window.innerWidth, // Ancho de la ventana del navegador
      height: 200,              // Altura del fondo
      backgroundColor: 0xAAAAAA, // Color del fondo en formato hexadecimal
    });
    //TIMELINE
    // this.app = new PIXI.Application({
    //   width: this.timelineLength,
    //   height: 10,
    //   backgroundColor: PIXI.Color.shared.blue
    // });
    this.pixiContainer.nativeElement.appendChild(this.app.view);

    //this.drawTimeline();
    this.drawBackground();
    this.drawLine();
    this.drawCircles()
  }

  drawTimeline() {
    this.timeline = new PIXI.Graphics();
    this.timeline.lineStyle(2, 0x000000);
    //this.timeline.moveTo(0, 50);
    this.timeline.lineTo(this.timelineLength, 50);
    this.app.stage.addChild(this.timeline);
  }

  drawBackground() {
    this.background = new PIXI.Graphics();
    this.background.beginFill(0xCCCCCC); // Color del fondo en formato hexadecimal
    this.background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    this.background.endFill();
    this.app.stage.addChild(this.background);
  }

  drawLine() {
    this.line = new PIXI.Graphics();
    this.line.lineStyle(2, 0xFF0000); // Grosor de línea y color en formato hexadecimal
    this.line.moveTo(50, this.app.screen.height / 2); // Punto de inicio de la línea (en el centro vertical)
    this.line.lineTo(this.app.screen.width-100, this.app.screen.height / 2); // Punto final de la línea (en el centro vertical)
    this.app.stage.addChild(this.line);
  }

  drawCircles() {
    // Círculo sobre la línea
    const circleAbove = new PIXI.Graphics();
    circleAbove.beginFill(0x00FF00); // Color del círculo en formato hexadecimal (verde)
    circleAbove.drawCircle(this.app.screen.width / 2, this.app.screen.height / 2 - 50, 20); // Posición (x, y) del centro del círculo y radio
    circleAbove.endFill();
    this.app.stage.addChild(circleAbove);

    const circleAbove1 = new PIXI.Graphics();
    circleAbove.beginFill(0x00FF00); // Color del círculo en formato hexadecimal (verde)
    circleAbove.drawCircle(this.app.screen.width / 3, this.app.screen.height / 2 - 50, 20); // Posición (x, y) del centro del círculo y radio
    circleAbove.endFill();
    this.app.stage.addChild(circleAbove1);

    // Círculo bajo la línea
    const circleBelow = new PIXI.Graphics();
    circleBelow.beginFill(0x0000FF); // Color del círculo en formato hexadecimal (azul)
    circleBelow.drawCircle(this.app.screen.width / 2, this.app.screen.height / 2 + 50, 20); // Posición (x, y) del centro del círculo y radio
    circleBelow.endFill();
    this.app.stage.addChild(circleBelow);
  }
}
