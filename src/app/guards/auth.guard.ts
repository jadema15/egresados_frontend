import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioServiceService } from '../services/usuario-service.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(UsuarioServiceService);
  const router = inject(Router);
  let objetoUsuario: any = "";

  objetoUsuario = localStorage.getItem("user");

  const userData: any = JSON.parse(objetoUsuario);

  return authService.getAuthToken().pipe(
    map((authenticated: boolean) => {
      if (authenticated) {
        return true;
      } else {
        router.navigate(['/login']); 
        return false;
      }
    })
  );
}

