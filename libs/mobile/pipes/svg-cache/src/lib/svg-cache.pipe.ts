import { Pipe, PipeTransform } from '@angular/core';
import {
  getFileNameFromUrl,
  getSvgFromCache,
  saveSvgToCache,
} from '@cockpit/mobile/util-filesystem';

@Pipe({
  name: 'svgCache',
  standalone: true,
})
export class SvgCachePipe implements PipeTransform {
  async transform(url: string): Promise<string> {
    const name = getFileNameFromUrl(url);

    const cached = await getSvgFromCache(name);
    if (cached) {
      return cached;
    }

    const response = await fetch(url);
    const blob = await response.blob();

    return saveSvgToCache(name, blob);
  }
}
