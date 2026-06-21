import { errorMessage } from "../../utils/error-message";
import * as InventoryRepository from "../../repositories/inventories-repository";
import * as UnitService from "../units/index";
import { InventoryItem } from "../../models/inventory-model";

export const createInventoryItemService = async (item: InventoryItem) => {
    try {
        const unit = await UnitService.getUnitByIdService(item.unidade_id);

        if (unit.statusCode !== 200) {
            return {
                statusCode: unit.statusCode,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada",
                    "/estoques/new",
                )
            }
        }

        const result = await InventoryRepository.createInventoryItem(item);

        return {
            statusCode: 201,
            content: result.rows[0]
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/estoques/new"
            )
        }
    }
}