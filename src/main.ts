import { bootstrapApplication } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';


bootstrapApplication(App, {
    providers: [
        provideRouter(routes, withComponentInputBinding()), // Enables the binding
        provideHttpClient(),
        provideBrowserGlobalErrorListeners(),
        // Note: ReactiveFormsModule is usually imported in components, not globally
    ]
}).catch(err => console.error(err));
