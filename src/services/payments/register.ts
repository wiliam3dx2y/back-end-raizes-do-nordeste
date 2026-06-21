import * as PaymentRepository from "../../repositories/payments-repository";
import { Payment } from "../../models/payment-service";

export const registerPaymentApprovedService = async (payment: Payment) => {
    await PaymentRepository.insertPaymentPaid(payment);
}

export const registerPaymentRefusedService = async (payment: Payment) => {
    await PaymentRepository.insertPaymentRefused(payment);
}