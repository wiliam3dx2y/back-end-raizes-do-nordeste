import * as PaymentRepository from "../../repositories/payments-repository";
import { Payment } from "../../models/payment-service";

export const cancelPaymentService = async (payment: Payment) => {
    await PaymentRepository.insertPaymentCanceled(payment);
}