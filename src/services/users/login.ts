import * as UserRepository from "../../repositories/users-repository";
import { errorMessage } from "../../utils/error-message";
import { checkPassword, generateToken } from "../auth/index";

export const postLoginService = async (email: string, password: string) => {
    try {
        const result = await UserRepository.findUserByEmail(email);
    
        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "USUARIO_NAO_ENCONTRADO",
                    "Usuário não foi encontrado no sistema",
                    "/auth/login",
                    [{ field: "email", issue: "Email não encontrado no sistema" }]
                )
            }

        }
    
        const user = result.rows[0];

        const isValid = await checkPassword(password, user.senha);
    
        if (!isValid) {
            return {
                statusCode: 401,
                content: errorMessage(
                    "LOGIN_RECUSADO",
                    "Usuário ou senha incorretos",
                    "/auth/login",
                )
            }
        }
    
        const token = generateToken(user.id, user.role);
    
        return {
            statusCode: 200,
            content: {
                message: "Login realizado com sucesso",
                token
            }
        }
    
      } catch (error) {
        console.log(error);
        return {
                statusCode: 500,
                content: errorMessage(
                    "ERRO_INTERNO_DO_SERVIDOR",
                    "Erro interno do servidor",
                    "/auth/login",
                )
            }
        
      }
}

export const getLoginService = async (usuario_id: number | undefined, usuario_role: string | undefined) => {
    try {
        if (!usuario_id || !usuario_role) {
            return {
                statusCode: 401,
                content: errorMessage(
                    "USUARIO_NAO_AUTENTICADO",
                    "Usuário não autenticado",
                    "/auth/login"
                )
            }
        }

        return {
            statusCode: 200,
            content: {
                user_id: usuario_id,
                role: usuario_role
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/auth/login",
            )
        }
    }
}