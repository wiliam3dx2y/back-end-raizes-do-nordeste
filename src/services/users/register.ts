import * as UserRepository from "../../repositories/users-repository";
import * as UnitRepository from "../../repositories/units-repository";
import { errorMessage } from "../../utils/error-message";
import { hashPassword } from "../auth/index";
import { ClientPointTransaction } from "../../models/user-model";

export const registerClientService = async (unidade_id: any, name: string, email: string, password: string, ativo_pontos: boolean) => {
    try {
        const existingUnit = await UnitRepository.findUnitById(unidade_id);
        const existingUser = await UserRepository.findUserByEmail(email);
    
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return {
                statusCode: 422,
                content: errorMessage(
                    "EMAIL_INVALIDO",
                    "Email formato inválido ou ausente",
                    "/auth/register",
                    [{ field: "email", issue: "Email inválido ou ausente" }]
                )
            }
        }

        if (existingUnit.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada no sistema",
                    "/auth/register",
                    [{ field: "unidade_id", issue: "Unidade não existe no sistema" }]
                )
            }
        }

        if (existingUser.rows.length > 0) {
            return {
                statusCode: 409,
                content: errorMessage(
                    "USUARIO_JA_EXISTE",
                    "Usuário já existe com esse email",
                    "/auth/register",
                    [{ field: "email", issue: "Email já cadastrado no sistema" }]
                )
            }
        }
    
        const hashedPassword = await hashPassword(password);

        const role = "cliente";

        const result = await UserRepository.createClient(unidade_id, name, email, hashedPassword, role, ativo_pontos);
    
        if (result.rowCount === 0) {
            return {
                statusCode: 500,
                content: errorMessage(
                    "ERRO_INTERNO_DO_SERVIDOR",
                    "Erro interno do servidor",
                    "/auth/register",
                )
            }
        }
    
        return {
            statusCode: 201,
            content: { message: "Cliente registrado com sucesso" }
        }
    
      } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/auth/register",
            )
        }
  }
}

export const registerPointTransactionService = async (transacao: ClientPointTransaction) => {
    return await UserRepository.registerPointTransaction(transacao);
}