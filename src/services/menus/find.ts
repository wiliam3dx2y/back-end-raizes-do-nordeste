import * as MenuRepository from "../../repositories/menus-repository";
import { errorMessage } from "../../utils/error-message";

export const getMenuService = async (unidade_id: string) => {
    try {
        const result = await MenuRepository.findMenuByUnitId(unidade_id);
        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "CARDAPIO_NAO_ENCONTRADO",
                    "Cardápio não encontrado para a unidade",
                    "/cardapio/:id",
                )
            }
            
        }

        const menu = result.rows;

        return {
            statusCode: 200,
            content: menu
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/cardapio/:id"
            )
        }
    }
}

export const getRecipeByProductIdService = async (id: string) => {
    try {
        const result = await MenuRepository.findRecipeByProductIdExtended(id);
        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "RECEITA_NAO_ENCONTRADA",
                    "Receita não encontrada para o produto do cardápio",
                    "/cardapio/recipe/:id",
                )
            }
            
        }

        const recipe = result.rows;

        return {
            statusCode: 200,
            content: recipe
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/cardapio/recipe/:id"
            )
        }
    }
}