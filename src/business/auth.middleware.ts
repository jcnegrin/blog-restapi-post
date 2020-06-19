/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {   
    
    if (req.headers && !req.headers.authorization) {
        throw new UnauthorizedException('No authorization headers.');
    }

    const token_bearer = req.headers.authorization.split(' ');

    if (token_bearer.length !== 2) {
        throw new UnauthorizedException('Malformed token.');
    }

    const token = token_bearer[1];

    return jwt.verify(token, process.env.JWT_SECRET,  (error) => {
        if(error) {
            throw new UnauthorizedException('Failed to Authenticate');
        }
        return next();
    })
  }
}