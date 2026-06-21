import * as MenuRepository from "../../repositories/menus-repository";
import { errorMessage } from "../../utils/error-message";
import { MenuItem, RecipeItem } from "../../models/menu-model";
import * as UnitRepository from "../../repositories/units-repository";
import * as InventoryRepository from "../../repositories/inventories-repository";

export const createMenuItemService = async (menuItem: MenuItem) => {
    try {
        const unitResult = await UnitRepository.findUnitById(menuItem.unidade_id);
        
        const itemExists = async () => {
            if (menuItem.id) {
                return await MenuRepository.findProductById(menuItem.id);
            }
        }

        if (!unitResult || unitResult.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada",
                    "/cardapio"
                )
            }
        }

        if (menuItem.id) {
            const productResult = await MenuRepository.findProductById(menuItem.id);
            if (productResult && productResult.rows.length > 0) {
                return {
                    statusCode: 409,
                    content: errorMessage(
                        "ITEM_CARDAPIO_JA_EXISTE",
                        "Item de cardápio já existe",
                        "/cardapio"
                    )
                }
            }
        }


        const result = await MenuRepository.createMenuItem(menuItem);

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
                "/cardapio"
            )
        }
    }
}

export const createRecipeItemService = async (recipeItem: RecipeItem) => {
    try {
        const productResult = await MenuRepository.findProductById(recipeItem.produto_cardapio_id);
        
        if (!productResult || productResult.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "PRODUTO_CARDAPIO_NAO_ENCONTRADO",
                    "Produto do cardápio não encontrado",
                    "/cardapio/recipe"
                )
            }
        }

        const inventoryResult = await InventoryRepository.findItemByItemId(recipeItem.estoque_item_id);

        if (!inventoryResult || inventoryResult.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "ITEM_ESTOQUE_NAO_ENCONTRADO",
                    "Item de estoque não encontrado",
                    "/cardapio/recipe"
                )
            }
        }

        if (recipeItem.id) {
            const recipeResult = await MenuRepository.findRecipeByRecipeId(recipeItem.id);
            if (recipeResult && recipeResult.rows.length > 0) {
                return {
                    statusCode: 409,
                    content: errorMessage(
                        "RECEITA_JA_EXISTE",
                        "ID de item de receita já existe",
                        "/cardapio/recipe"
                    )
                }
            }
        }

        const result = await MenuRepository.createRecipeItem(recipeItem);

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
                "/cardapio/recipe"
            )
        }
    }
}