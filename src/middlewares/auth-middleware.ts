import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorMessage } from "../utils/error-message";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Tipagem personalizada
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    // Verifica se enviou token
    if (!authHeader) {
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

    // Formato esperado:
    // Bearer TOKEN
    const [, token] = authHeader.split(" ");

    if (!token) {
      let message = {
        statusCode: 401,
        content: errorMessage(
          "RECUSADO",
          "Token não fornecido",
          req.path
        )
      }
      
      return res.status(message.statusCode).json(message.content);
    }

    // Verifica token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    // Salva dados do usuário na request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (err) {
    let message = {
      statusCode: 401,
      content: errorMessage(
        "USUARIO_NAO_AUTENTICADO",
        "Token inválido ou expirado",
        req.path
      )
    };
    return res.status(message.statusCode).json(message.content);
  }
}