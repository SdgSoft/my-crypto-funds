import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { App } from './app/app';
import { AppRoutingModule } from './app/app-routing-module';

bootstrapApplication(App, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, ReactiveFormsModule),
        provideBrowserGlobalErrorListeners(),
        provideHttpClient()
    ]
})
  .catch(err => console.error(err));
