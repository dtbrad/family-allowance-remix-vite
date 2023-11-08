import type {Role} from './Role';

export interface Transaction {
    date: string;
    amount: number;
    description: string;
}

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
