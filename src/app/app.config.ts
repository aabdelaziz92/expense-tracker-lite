import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ArrowDown, ArrowLeft, ArrowUp, Car, FerrisWheel, Fuel, HandCoins, House, LucideAngularModule, Plus, ShoppingCart, User } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick({
      User,
      ArrowUp,
      ArrowDown,
      ShoppingCart,
      FerrisWheel,
      Car,
      Fuel,
      House,
      HandCoins,
      Plus,
      ArrowLeft
    })),
  ]
};
