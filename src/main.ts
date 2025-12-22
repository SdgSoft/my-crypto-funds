import { platformBrowser, BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing-module';
import { ReactiveFormsModule } from '@angular/forms';
import { App } from './app/app';

bootstrapApplication(App, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, ReactiveFormsModule),
        provideBrowserGlobalErrorListeners(),
        provideHttpClient()
    ]
})
  .catch(err => console.error(err));
