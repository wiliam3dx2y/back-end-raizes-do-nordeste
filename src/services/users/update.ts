import * as UserRepository from "../../repositories/users-repository";
import { errorMessage } from "../../utils/error-message";

export const updateMembershipPointsService = async (usuario_id: number | undefined, ativo_pontos: boolean) => {
    try {
        if (!usuario_id) {
            return {
                statusCode: 401,
                content: errorMessage(
                    "USUARIO_NAO_AUTENTICADO",
                    "Usuário não autenticado",
                    "/auth/update/membership"
                )
            }
        }

        const result = await UserRepository.updateMembershipPoints(usuario_id, ativo_pontos);

        if (result.rowCount === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "USUARIO_NAO_ENCONTRADO",
                    "Usuário não encontrado",
                    "/auth/update/membership"
                )
            }
        }

        return {
            statusCode: 200,
            content: { message: "Adesão ao programa de fidelidade atualizada com sucesso" }
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/auth/update/membership"
            )
        }
    }
}

export const updatePoints = async (usuario_id: string, pontos: number) => {
    return await UserRepository.updatePoints(usuario_id, pontos);
}