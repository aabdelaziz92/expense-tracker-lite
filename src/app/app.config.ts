import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ArrowDown, ArrowLeft, ArrowUp, BanknoteArrowUp, Car, FerrisWheel, Fuel, Gift, HandCoins, House, LucideAngularModule, Pizza, Plus, Shapes, ShoppingCart, User, X } from 'lucide-angular';

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
      ArrowLeft,
      X,
      Pizza,
      Shapes,
      BanknoteArrowUp,
      Gift
    })),
  ]
};
