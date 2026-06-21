import { Request, Response } from "express";
import * as CouponsService from "../services/coupons/index";
import { Coupon, PrivateCoupon, RedeemCoupon } from "../models/coupon-model";

export const getCoupons = async (req: Request, res: Response) => {
        let message = await CouponsService.getAllCouponsService();
    
        return res.status(message.statusCode).json(message.content);
}

export const createCoupon = async (req: Request, res: Response) => {
    const couponData = req.body as Coupon;

    let message = await CouponsService.createCouponService(couponData);

    return res.status(message.statusCode).json(message.content);
}

export const createPrivateCoupon = async (req: Request, res: Response) => {
    const privateCouponData = req.body as PrivateCoupon;

    let message = await CouponsService.createPrivateCouponService(privateCouponData);

    return res.status(message.statusCode).json(message.content);
}

export const redeemCoupon = async (req: Request, res: Response) => {
    const redeemCouponData = req.body as RedeemCoupon;

    let message = await CouponsService.redeemCouponService(redeemCouponData);

    return res.status(message.statusCode).json(message.content);
}