import * as OrderRepository from "../../repositories/orders-repository";
import * as PaymentRepository from "../../repositories/payments-repository";
import { errorMessage } from "../../utils/error-message";

export const updateOrderStatusService = async (order_id: string, status: string) => {
    try {
        const orderResult = await OrderRepository.findOrderById(order_id);
        if (orderResult.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "PEDIDO_NAO_ENCONTRADO",
                    "Pedido não encontrado",
                    "/pedidos/:id"
                )
            }
        }
        
        if (orderResult.rows[0].status === "entregue" || orderResult.rows[0].status === "cancelado") {
            return {
                statusCode: 400,
                content: errorMessage(
                    "ALTERACAO_STATUS_PEDIDO_INDISPONIVEL",
                    "Não é permitido alterar o status de um pedido entregue ou cancelado",
                    "/pedidos/:id"
                )
            }
        }

        await OrderRepository.updateOrderStatus(order_id, status);

        return {
            statusCode: 200,
            content: { message: "Status do pedido atualizado com sucesso" }
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "INTERNAL_SERVER_ERROR",
                "Erro interno do servidor",
                "/pedidos/:id"
            )
        }
    }
}

export const cancelOrderService = async (order_id: string) => {
    try {
        const orderResult = await OrderRepository.findOrderById(order_id);
        if (orderResult.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "PEDIDO_NAO_ENCONTRADO",
                    "Pedido não encontrado",
                    "/pedidos/cancel/:id"
                )
            }
        }

        const order = orderResult.rows[0];

        if (order.status === "cancelado") {
            return {
                statusCode: 409,
                content: errorMessage(
                    "PEDIDO_JA_CANCELADO",
                    "Pedido já está cancelado",
                    "/pedidos/cancel/:id"
                )
            }
        }

        if (order.status === "entregue") {
            return {
                statusCode: 409,
                content: errorMessage(
                    "PEDIDO_JA_ENTREGUE",
                    "Pedido já foi entregue",
                    "/pedidos/cancel/:id"
                )
            }
        }

        await OrderRepository.updateOrderStatus(order_id, "cancelado");
        await PaymentRepository.insertPaymentCanceled({
            unidadeId: order.unidade_id,
            pedidoId: order.id,
            metodoPagamento: order.forma_pagamento,
            valor: order.total,
            status: "cancelado"
        });

        return {
            statusCode: 200,
            content: { message: "Pedido cancelado com sucesso" }
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/pedidos/cancel/:id"
            )
        }
    }
}