import * as CouponRepository from "../../repositories/coupons-repository";

export const getAllCouponsService = async () => {
        const result = await CouponRepository.findAllCoupons();

        if (result.rows.length === 0){
            return {
                statusCode: 204,
                content: { message: "Nenhum cupom encontrado" }
            }
        }

        return {
            statusCode: 200,
            content: result.rows
        }
}