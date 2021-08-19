import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { Response, Request } from 'express';
import { environment } from '../config/environment';

export interface IContext {
    req: Request,
    res: Response,
    payload: { userId: string }
};

export const isAuth: MiddlewareFn<IContext> = ({ context }, next) => {

    try {
        const bearerToken = context.req.headers["authorization"];

        if (!bearerToken) {
            throw new Error('Unauthorized');
        };

        const jwt = bearerToken.split(" ")[1];
        const payload = verify(jwt, environment.JWT_SECRET);
        context.payload = payload as any;

    } catch (e) {
        throw new Error(e);
    }

    return next();

}