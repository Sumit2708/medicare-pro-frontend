import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';


import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient()
    ,provideNativeDateAdapter(),
    {
    provide: MAT_DATE_LOCALE,
    useValue: 'en-IN'
  }
]
};
