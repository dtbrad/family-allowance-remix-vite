import * as jose from 'jose';
import {UserFromToken} from '../domain/User';
import 'dotenv/config';

export default async function getUserFromToken(
    token: string | undefined
): Promise<UserFromToken | undefined> {
    if (!token) {
        return;
    }

    try {
        const {payload} = await jose.jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );

        const {userId, role} = payload as UserFromToken;

        if (userId && role) {
            return {userId, role};
        }
    } catch (error) {
        return;
    }
}
