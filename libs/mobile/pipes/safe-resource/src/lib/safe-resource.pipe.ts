import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeResource',
  standalone: true,
})
export class SafeResourcePipe implements PipeTransform {
  private readonly _domSanitizer = inject(DomSanitizer);

  transform(url: string) {
    return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
