import { findAvailablePrivateCoupons, findCouponByCodeAndUnitId, incrementCouponUsage, updateCouponStatusToUsed } from "../../repositories/coupons-repository";
import { errorMessage } from "../../utils/error-message";
import { getOrderByIdService } from "../orders/index";

export const useCouponService = async (unidade_id: string, order_id: string, usuario_id: string, cupom_codigo: string) => {
    try {
        const cupomResult = await findCouponByCodeAndUnitId(cupom_codigo, unidade_id);
        const order = await getOrderByIdService(order_id);

        if (cupomResult.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "CUPOM_NAO_ENCONTRADO",
                    "Cupom não encontrado",
                    "/pagamentos"
                )
            };
        }

        const cupom = cupomResult.rows[0];

        if (cupom.valor_minimo_pedido > order.content.total) {
            return {
                statusCode: 400,
                content: errorMessage(
                    "VALOR_MINIMO_PEDIDO_NAO_ATINGIDO",
                    "Valor mínimo do pedido não atingido para usar este cupom",
                    "/pagamentos"
                )
            };
        }

        if (new Date(cupom.expira_em) <= new Date()) {
            return {
                statusCode: 400,
                content: errorMessage(
                    "CUPOM_EXPIRADO",
                    "Este cupom já expirou",
                    "/pagamentos"
                )
            };
        }

        if (cupom.publico === true) {
            if (cupom.max_usos === cupom.usos) {
                return {
                    statusCode: 400,
                    content: errorMessage(
                        "LIMITE_USO_CUPOM_ATINGIDO",
                        "Limite de uso do cupom atingido",
                        "/pagamentos"
                    )
                };
            } else {
                await incrementCouponUsage(cupom.id);
            }

        } else {
            const cupom_usuario = await findAvailablePrivateCoupons(usuario_id, cupom.id);

            if (cupom_usuario.rows.length === 0) {
                return {
                    statusCode: 404,
                    content: errorMessage(
                        "CUPOM_VALIDO_NAO_ENCONTRADO",
                        "Cupom válido não encontrado para este usuário",
                        "/pagamentos"
                    )
                };
            }
            
            await updateCouponStatusToUsed(cupom_usuario.rows[0].id);
        }

        
        const valor_desconto = cupom.tipo === "porcentagem" 
            ? order.content.total * (cupom.valor / 100) 
            : cupom.valor;
 
        return {
            statusCode: 200,
            content: { desconto: valor_desconto }
        };

    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/pagamentos"
            )
        };
    }
}