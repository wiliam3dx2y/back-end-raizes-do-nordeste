import { errorMessage } from "../../utils/error-message";
import { getUnitByIdService } from "../units/find";
import * as CouponRepository from "../../repositories/coupons-repository";
import { findUserById } from "../../repositories/users-repository";
import { Coupon, PrivateCoupon } from "../../models/coupon-model";

export const createCouponService = async (cupom: Coupon) => {
    try {
        const unidade_existe = await getUnitByIdService(cupom.unidade_id);
        const codigo_existe = await CouponRepository.findCouponByCodeAndUnitId(cupom.codigo, cupom.unidade_id);

        if(unidade_existe.statusCode !== 200) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada para associar ao cupom",
                    "/cupons"
                )
            }
        }

        if(codigo_existe.rows.length > 0) {
            return {
                statusCode: 409,
                content: errorMessage(
                    "CODIGO_JA_EXISTE",
                    "Cupom já existe para esta unidade",
                    "/cupons"
                )
            }
        }

        const result = await CouponRepository.createCoupon(cupom);

        return {
            statusCode: 201,
            content: { message: "Cupom criado com sucesso", cupom: result.rows[0] }
        }

    } catch (error) {
        console.error("Error creating coupon:", error);
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/cupons"
            )
        }
    }
}

export const createPrivateCouponService = async (cupom: PrivateCoupon) => {
    try {
        const unidade_existe = await getUnitByIdService(cupom.unidade_id);
        const usuario_existe = await findUserById(cupom.usuario_id);
        const cupom_existe = await CouponRepository.findCouponByCouponIdAndUnitId(cupom.cupom_id, cupom.unidade_id);

        if(unidade_existe.statusCode !== 200) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada",
                    "/cupons/private"
                )
            }
        }

        if(usuario_existe.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "USUARIO_NAO_ENCONTRADO",
                    "Usuário não encontrado",
                    "/cupons/private"
                )
            }
        } 

        if (cupom_existe.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "CUPOM_NAO_ENCONTRADO",
                    "Cupom não encontrado",
                    "/cupons/private"
                )
            }
        }

        const result = await CouponRepository.createPrivateCoupon(cupom);

        return {
            statusCode: 201,
            content: { message: "Cupom privado criado com sucesso", cupom: result.rows[0] }
        }

    } catch(error){
        console.log(error);
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/cupons/private"
            )
        }  
    }
}