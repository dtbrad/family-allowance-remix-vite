import type {Role} from './Role';
import type {Transaction} from './Transaction';

export interface User {
    userId: string;
    role: Role;
    balance: number;
    allowanceAmount: number;
    transactions?: Transaction[];
    dayPreference: string;
    passwordDigest: string;
    accessToken: string;
}

export type UserFromToken = Pick<User, 'userId' | 'role'>;
