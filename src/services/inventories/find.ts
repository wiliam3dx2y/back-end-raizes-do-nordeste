import { errorMessage } from "../../utils/error-message";
import * as InventoryRepository from "../../repositories/inventories-repository";
import * as UnitService from "../units/index";

export const getInventoryLogByUnitIdService = async (unidade_id: string) => {
    try {
        const unit = await UnitService.getUnitByIdService(unidade_id);

        if (unit.statusCode !== 200) {
            return {
                statusCode: unit.statusCode,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada",
                    "/estoques/log/:id",
                )
            }
        }

        const result = await InventoryRepository.findInventoryMovementsByUnitId(unidade_id);

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "NENHUMA_MOVIMENTACAO_DE_ESTOQUE_ENCONTRADA",
                    "Nenhuma movimentação de estoque encontrada para a unidade",
                    "/estoques/log/:id"
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
                "/estoques/log/:id"
            )
        }
    }
}

export const getInventoryItemsByUnitIdService = async (unidade_id: string) => {
    try {
        const result = await InventoryRepository.findInventoryItemsByUnitId(unidade_id);

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "NENHUM_ITEM_DE_ESTOQUE_ENCONTRADO",
                    "Nenhum item de estoque encontrado para a unidade",
                    "/estoques/:id",
                )
            }
        }

        const inventoryItems = result.rows;

        return {
            statusCode: 200,
            content: inventoryItems
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/estoques/:id",
            )
        }
    }
}