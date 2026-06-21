import * as OrderRepository from "../../repositories/orders-repository";
import { errorMessage } from "../../utils/error-message";

export const getAllOrdersByUnitIdService = async (unidade_id: string) => {
    try {
        const result = await OrderRepository.findOrdersByUnitId(unidade_id);
        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "PEDIDO_NAO_ENCONTRADO",
                    "Nenhum pedido encontrado para a unidade",
                    "/pedidos/:id",
                )
            }
        }

        const orders = result.rows;

        return {
            statusCode: 200,
            content: orders
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/pedidos/:id",
            )
        }
    }
}

export const getAllOrderItemsByOrderIdService = async (order_id: string) => {
    try {
        const result = await OrderRepository.findOrderItemsByOrderId(order_id);
        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "ITEM_PEDIDO_NAO_ENCONTRADO",
                    "Nenhum item encontrado para o pedido",
                    "/pedidos/items/:id"
                )
            }
        }

        const orderItems = result.rows;

        return {
            statusCode: 200,
            content: orderItems
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/pedidos/items/:id"
            )
        }
    }
}

export const getOrderByIdService = async (order_id: string) => {
    try {
        const result = await OrderRepository.findOrderById(order_id);
        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "PEDIDO_NAO_ENCONTRADO",
                    "Pedido não encontrado",
                    "/pedidos/status/:id"
                )
            }
        }

        const order = result.rows[0];

        return {
            statusCode: 200,
            content: order
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/pedidos/status/:id"
            )
        }
    }
}