import { findPaymentsByOrderId } from "../../repositories/payments-repository";
import * as PaymentService from "../payments/index";
import { getOrderByIdService } from "../orders/find";
import { errorMessage } from "../../utils/error-message";
import { findUserByEmail } from "../../repositories/users-repository";
import * as UserService from "../users/index";

export async function processPaymentService(order_id: string, cliente_email: string, cupom_codigo?: string) {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        let user = await findUserByEmail(cliente_email);
        let order = await getOrderByIdService(order_id);
        let payment = await findPaymentsByOrderId(order_id);

        if (!user || user.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "USUARIO_NAO_ENCONTRADO",
                    "Usuário não encontrado",
                    "/pagamentos"
                )
            }
        }

        if (!order || order.statusCode !== 200 || !payment?.rows || payment.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "PEDIDO_OU_PAGAMENTO_NAO_ENCONTRADO",
                    "Pedido ou pagamento não encontrado",
                    "/pagamentos/"
                )
            }
        }

        if (payment.rows[0].status === "pago") {
            return {
                statusCode: 400,
                content: errorMessage(
                    "PAGAMENTO_JA_APROVADO",
                    "Pagamento já aprovado",
                    "/pagamentos/"
                )
            }
        }
        

        let useCouponResponse = cupom_codigo 
    ? await PaymentService.useCouponService(order.content.unidade_id, order.content.id, user.rows[0].id, cupom_codigo) 
    : null;

        let valor_desconto = (useCouponResponse && useCouponResponse.statusCode === 200) 
            ? (useCouponResponse.content as any).desconto 
            : 0;

        const random = Math.random();

        if (random < 0.7 && payment.rows[0].status !== "pago" && payment.rows[0].status !== "cancelado") {
            let registerPayment = {
                unidadeId: order.content.unidade_id,
                pedidoId: order.content.id,
                metodoPagamento: order.content.forma_pagamento,
                valor: order.content.total - (valor_desconto || 0),
                status: "pago"
            }
           
            await PaymentService.registerPaymentApprovedService(registerPayment);

            if (user.rows[0].ativo_programa_fidelidade) {
                if (order.content.total >= 1){
                    const pontos_ganhos = Math.floor(order.content.total);
                    await UserService.updatePoints(user.rows[0].id, pontos_ganhos);
                    await UserService.registerPointTransactionService({
                        unidade_id: order.content.unidade_id,
                        usuario_id: user.rows[0].id,
                        pontos: pontos_ganhos,
                        tipo_transacao: "ganho",
                        descricao: `Acúmulo de pontos pelo pedido ${order.content.id}`
                    });
                }
            }
  
            return {
                statusCode: 200,
                content: {
                    status: "Pagamento aprovado",
                }
            }
        }

        if (random < 0.9 && payment.rows[0].status !== "pago" && payment.rows[0].status !== "cancelado") {
            let registerPayment = {
                unidadeId: order.content.unidade_id,
                pedidoId: order.content.id,
                metodoPagamento: order.content.forma_pagamento,
                valor: order.content.total,
                status: "recusado"
            }

            await PaymentService.registerPaymentRefusedService(registerPayment);
            return {
                statusCode: 400,
                content: errorMessage(
                    "PAGAMENTO_RECUSADO",
                    "Pagamento recusado",
                    "/pagamentos"
                )
            }
        }

        return {
            statusCode: 500,
            content: errorMessage(
                "PAGAMENTO_PENDENTE",
                "Pagamento pendente, tente novamente mais tarde",
                "/pagamentos"
            )
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/pagamentos"
            )
        }
    }
}