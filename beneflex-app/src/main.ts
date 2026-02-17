import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './app/auth-config'; // o donde tengas tu msalConfig

// platformBrowser().bootstrapModule(AppModule, {
//   ngZoneEventCoalescing: true,
// })
//   .catch(err => console.error(err));

const pca = new PublicClientApplication(msalConfig);

pca.initialize().then(() => {
  // si quieres, también procesa redirects aquí:
  // return pca.handleRedirectPromise();
}).then(() => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
