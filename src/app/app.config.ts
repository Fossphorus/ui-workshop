import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideIonicAngular(),
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ]
};
