import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventPageComponent } from '@cockpit/event-page';

@Component({
  standalone: true,
  imports: [EventPageComponent, RouterModule],
  selector: 'cockpit-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'exercisr';
}
