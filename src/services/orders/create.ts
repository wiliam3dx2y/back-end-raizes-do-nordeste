import * as OrderRepository from "../../repositories/orders-repository";
import * as InventoryRepository from "../../repositories/inventories-repository";
import * as UnitRepository from "../../repositories/units-repository";
import * as MenuRepository from "../../repositories/menus-repository";
import * as PaymentRepository from "../../repositories/payments-repository";
import { errorMessage } from "../../utils/error-message";
import { calculateOrderTotal } from "./calculate";

export const createOrderService = async (unidade_id: string, orderData: { items: Array<{ produto_id: string; quantidade: number }>}, canal_pedido: string, forma_pagamento: string) => {
    try {
        const unitResult = await UnitRepository.findUnitById(unidade_id);
        if (unitResult.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada",
                    "/pedidos"
                )
            }
        }

        for (const item of orderData.items) {
            const productResult = await MenuRepository.findProductById(item.produto_id);
            if (productResult.rows.length === 0 || !productResult.rows[0].ativo) {
                return {
                    statusCode: 404,
                    content: errorMessage(
                        "PRODUTO_NAO_ENCONTRADO_OU_INATIVO",
                        `Produto ${item.produto_id} não encontrado ou inativo`,
                        "/pedidos"
                    )
                }
            }

            const recipeResult = await MenuRepository.findRecipeByProductId(item.produto_id);
            if (recipeResult.rows.length === 0) {
                return {
                    statusCode: 404,
                    content: errorMessage(
                        "RECEITA_NAO_ENCONTRADA",
                        `Receita não encontrada para o produto ${item.produto_id}`,
                        "/pedidos"
                    )
                }
            }

            for (const recipeItem of recipeResult.rows) {
                const stockResult = await InventoryRepository.findItemByItemId(recipeItem.estoque_item_id);               
                if (stockResult.rows.length === 0) {
                    return {
                        statusCode: 404,
                        content: errorMessage(
                            "ITEM_ESTOQUE_NAO_ENCONTRADO",
                            `Item de estoque ${recipeItem.estoque_item_id} não encontrado`,
                            "/pedidos"
                        )
                    }
                }

                const requiredQuantity = recipeItem.quantidade * item.quantidade;
                const availableQuantity = stockResult.rows[0].estoque_atual;

                if (availableQuantity < requiredQuantity) {
                    return {
                        statusCode: 422,
                        content: errorMessage(
                            "ESTOQUE_INSUFICIENTE",
                            `Quantidade insuficiente em estoque para o item ${recipeItem.estoque_item_id}. Disponível: ${availableQuantity}, Necessário: ${requiredQuantity}`,
                            "/pedidos"
                        )
                    }
                }
            }
        }

    
        const total = await calculateOrderTotal(orderData.items);
        
        const status = "cozinha"

        const orderResult = await OrderRepository.createOrder(unidade_id, total, canal_pedido, forma_pagamento, status);
        const order_id = orderResult.rows[0].id;

        // Create order items
        for (const item of orderData.items) {
            const productResult = await MenuRepository.findProductById(item.produto_id);
            const product = productResult.rows[0];
            const subtotal = product.preco * item.quantidade;
            await OrderRepository.createOrderItem(order_id, item.produto_id, item.quantidade, product.preco, subtotal);

            // Deduct from stock and record movement
            const recipeResult = await MenuRepository.findRecipeByProductIdExtended(item.produto_id);
            for (const recipeItem of recipeResult.rows) {
                const requiredQuantity = recipeItem.quantidade * item.quantidade;
                await InventoryRepository.updateInventory(recipeItem.estoque_item_id, -requiredQuantity);
                // Record stock movement
                await InventoryRepository.createInventoryMovement(unidade_id, recipeItem.estoque_item_id, recipeItem.nome_ingrediente, "saida", requiredQuantity);
            }
        }

        // Create pending payment record
        await PaymentRepository.createOrderPayment(unidade_id, order_id, forma_pagamento, total, "pendente");

        return {
            statusCode: 201,
            content: { order_id, message: "Pedido criado com sucesso" }
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/pedidos"
            )
        }
    }
}