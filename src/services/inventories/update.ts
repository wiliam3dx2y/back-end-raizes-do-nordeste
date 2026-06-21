import { errorMessage } from "../../utils/error-message";
import * as InventoryRepository from "../../repositories/inventories-repository";
import * as UnitService from "../units/index";

export const updateInventoryItemService = async (unidade_id: string, item_id: string, quantidade: number, acao: string) => {
    try {
        const unit = await UnitService.getUnitByIdService(unidade_id);

        if (unit.statusCode !== 200) {
            return {
                statusCode: unit.statusCode,
                content: unit.content
            }
        }

        const item = await InventoryRepository.findItemByItemId(item_id);
        
        if (item.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "NENHUM_ITEM_DE_ESTOQUE_ENCONTRADO",
                    `Item de estoque ${item_id} não encontrado`,
                    "/estoques/update"
                )
            }
        }

        if (acao === "adicionar") {
            await InventoryRepository.updateInventory(item_id, quantidade);
            await InventoryRepository.createInventoryMovement(item.rows[0].unidade_id, item_id, item.rows[0].nome, "entrada", quantidade);
        } else if (acao === "remover") {
            await InventoryRepository.updateInventory(item_id, -quantidade);
            await InventoryRepository.createInventoryMovement(item.rows[0].unidade_id, item_id, item.rows[0].nome, "saida", quantidade);
        } else {
            return {
                statusCode: 400,
                content: errorMessage(
                    "ACAO_INVALIDA",
                    "Ação inválida.",
                    "/estoques/update",
                     [
                        {
                            "field": "acao",
                            "issue": "Valor deve ser 'adicionar' ou 'remover'"
                        }
                    ],
                )
            }
        }

        return {
            statusCode: 200,
            content: { 
                message: "Item de estoque atualizado com sucesso",
                item: await InventoryRepository.findItemByItemId(item_id).then(res => res.rows[0])
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/estoques/update"
            )
        }
    }
}