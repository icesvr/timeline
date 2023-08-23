import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { TimelineCanvasComponent } from './components/timeline-canvas/timeline-canvas.component';
import { TimelineZoomComponent } from './components/timeline-zoom/timeline-zoom.component';
import { TimelineScaleComponent } from './components/timeline-scale/timeline-scale.component';
import { TimeComponent } from './components/time/time.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    TimelineCanvasComponent,
    TimelineZoomComponent,
    TimelineScaleComponent,
    TimeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
