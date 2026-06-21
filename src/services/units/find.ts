import { findAllUnits } from "../../repositories/units-repository";
import { errorMessage } from "../../utils/error-message";
import * as UnitRepository from "../../repositories/units-repository";

export const getAllUnitsService = async () => {
    try {
        const result = await findAllUnits();

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "NENHUMA_UNIDADE_ENCONTRADA",
                    "Nenhuma unidade encontrada no sistema",
                    "/unidades",
                )
            }
        }

        return {
            statusCode: 200,
            content: result.rows
        }

      } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/unidades",
            )
        }
    }
}

export const getUnitByIdService = async (unidade_id: string) => {
    try {
        const result = await UnitRepository.findUnitById(unidade_id);

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada",
                    "/unidades/:id",
                )
            }
        }

        return {
            statusCode: 200,
            content: result.rows[0]
        };

      } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/unidades/:id",
            )
        }
    }
}
