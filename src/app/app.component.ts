import { Component } from '@angular/core';
import { Event, Router, NavigationStart , NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showLoader = true;

  // subscribing to th event while navigation between pages
  // NavigationStart -- is fired when we navigation starts
  // NavigationEnd -- is fired when navigation ends
  constructor(private router: Router){
    this.router.events.subscribe((event: Event ) =>
    {

      if (event instanceof NavigationStart){
        this.showLoader = true;
      }

      if (event instanceof NavigationEnd)
      {
        this.showLoader = false;
      }
      if (event instanceof NavigationCancel)  // hiding spinner when navigation in cancelled (like javascript confirmation popup)
      {
        this.showLoader = false;
      }
      if (event instanceof NavigationError) /// hiding spinner when error in navigation (like javascript confirmation popup)
      {
        this.showLoader = false;
      }
    });

  }
}
