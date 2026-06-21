import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth-middleware";
import { errorMessage } from "../utils/error-message";

export function roleMiddleware(allowedRoles: string[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {

    const userRole = req.user?.role;

    if (!userRole) {
      let message = {
        statusCode: 401,
        content: errorMessage(
          "USUARIO_NAO_AUTENTICADO",
          "Usuário não autenticado",
          req.path
        )
      }
      
      return res.status(message.statusCode).json(message.content);
    }

    if (!allowedRoles.includes(userRole) && !allowedRoles.includes("*")) {
      let message = {
        statusCode: 403,
        content: errorMessage(
          "SEM_PERMISSAO",
          "Usuário sem permissão",
          req.path
        )
      }

      return res.status(message.statusCode).json(message.content);
    }

    next();
  };
}