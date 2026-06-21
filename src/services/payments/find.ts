import * as PaymentRepository from "../../repositories/payments-repository";
import { errorMessage } from "../../utils/error-message";

export const getPaymentsLogByUnitIdService = async (unidade_id: string) => {
    try {
        const result = await PaymentRepository.findPaymentsByUnitId(unidade_id);

        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "NENHUM_REGISTRO_NO_LOG_DE_PAGAMENTO",
                    "Nenhum registro de pagamento encontrado para a unidade",
                    "/pagamentos/log/:id"
                )
            }
        }

        const paymentLog = result.rows;

        return {
            statusCode: 200,
            content: paymentLog
        }
    } catch (error) {
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/pagamentos/log/:id"
            )
        }
    }
}