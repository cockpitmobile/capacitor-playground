import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import 'zone.js/plugins/zone-patch-rxjs';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'cockpit-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'exercisr';

  constructor(
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.router.navigate(['/test']);
  }
}
