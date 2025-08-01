import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '@cockpit/mobile-projects-data-access';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersService } from '@cockpit/mobile-data-access-users';

@Component({
  selector: 'app-event-explore-page',
  imports: [CommonModule],
  templateUrl: './event-explore-page.component.html',
  styleUrl: './event-explore-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventExplorePageComponent {
  private readonly _eventsService = inject(EventService);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _userService = inject(UsersService);

  public readonly currentEvent = this._eventsService.currentEvent;
  public readonly currentUser = this._userService.currentUser;

  public readonly sanitizedLink = computed(() => {
    const eventInfo = this.currentEvent();
    const user = this.currentUser();
    // let device;
    // if (this.device.model && this.device.manufacturer) {
    //   device = `${this.device.model} ${this.device.manufacturer}`;
    //   while (device.includes(' ')) {
    //     device = device.replace(' ', '-');
    //   }
    // }
    // TODO: check for sanitized link
    if (eventInfo?.event_details_link && user?.id) {
      // + '&build_version=' + this.mainUtil.buildVersion + '&os=' + this.deviceDetectorService.os + '&app_version=' + (this.mainUtil.isIOS ? WebVersion.iosVersion : WebVersion.androidVersion)
      //         + (device ? '&device=' + device : '')
      // this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.event_details_link + '?user_id=' + this.userService.currentUser.id +
      //   '&project_id=' + this.project.id + '&build_version=' + this.mainUtil.buildVersion + '&os=' + this.deviceDetectorService.os + '&app_version=' + (this.mainUtil.isIOS ? WebVersion.iosVersion : WebVersion.androidVersion)
      //   + (device ? '&device=' + device : ''));

      return this._sanitizer.bypassSecurityTrustResourceUrl(
        eventInfo.event_details_link +
          '?user_id=' +
          user.id +
          '&project_id=' +
          eventInfo.id
      );
    }

    return undefined;
  });
}
