import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).isLoggedIn === false) {
    inject(Router).navigate(['/login']);
    return false;
  } // if log in state is falase, return back to log in page
    else {
      return true;
    }
};
