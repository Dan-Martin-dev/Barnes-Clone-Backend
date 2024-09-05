import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const result = request?.currentUser?.roles
      .map((role: string) => allowedRoles.includes(role))
      .find((val: boolean) => val === true);
    if (result) return true;
    throw new UnauthorizedException('sorry, you are not authorized');
  }
}
/* Un guard es una clase que decide si una petición HTTP será procesada por el controlador,
 o si será rechazada antes de llegar a él. Son utilizadas en autentication y autorizacion */

/* Injectable: Hace que el guard sea inyectable, permitiendo que NestJS lo administre como un servicio. */

/* CanActivate: Interfaz que el guard debe implementar para definir su lógica de autorización. */

/* ExecutionContext: Proporciona contexto sobre la ejecución actual, como la solicitud HTTP. */

/* UnauthorizedException: Excepción lanzada si el usuario no tiene permiso para acceder al recurso. */

/* Reflector: Utilizado para acceder a metadatos definidos en los controladores y rutas */

/* Clase AuthorizationGuard:

Es inyectable y utiliza la clase Reflector para obtener metadatos de las rutas que indiquen los roles permitidos.
El método canActivate es donde se define la lógica para permitir o denegar el acceso. */

/* Lógica del guard:

Acceso a los roles permitidos:
Se usa el Reflector para obtener los roles permitidos desde los metadatos que se hayan añadido al manejador de la ruta 
(por ejemplo, usando un decorador como @Roles en un controlador).

Obtención de la solicitud y el usuario actual:
Se accede a la solicitud HTTP actual mediante context.switchToHttp().getRequest() para obtener información del usuario autenticado. Se espera que el objeto currentUser ya haya sido añadido a la solicitud (por ejemplo, a través de un middleware previo).

Verificación de roles:
Se obtiene la lista de roles del usuario (request.currentUser.roles).
La función map compara los roles del usuario con los roles permitidos (allowedRoles.includes(role)).
La función find busca si alguno de los roles del usuario coincide con los permitidos.

Autorización:
Si se encuentra un rol que coincida con los permitidos (result === true), el guard permite que la solicitud continúe.
Si no hay coincidencia, se lanza una excepción de UnauthorizedException, bloqueando el acceso.
Uso típico del guard:
Este guard sería utilizado en rutas que requieren que el usuario tenga uno o más roles específicos para acceder. Los roles permitidos probablemente se añaden a través de un decorador como:

Resumen:
El AuthorizationGuard verifica si el usuario autenticado tiene alguno de los roles necesarios para acceder a una ruta.
Si tiene al menos uno de los roles permitidos, la solicitud continúa. 
Si no, el guard bloquea la solicitud y lanza una excepción de "No autorizado".
*/
