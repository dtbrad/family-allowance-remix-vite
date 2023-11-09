import {
    redirect,
    type ActionFunctionArgs,
    type LoaderFunctionArgs
} from '@remix-run/node';
import {Link, useLoaderData} from '@remix-run/react';
import UpdateBalanceForm from '~/components/UpdateBalanceForm';
import UserSummaryTable from '~/components/UserSummaryTable';
import getUser from '~/db/getUser';
import getUserTransactions from '~/db/getUserTransactions';
import updateBalance from '~/db/updateBalance';
import {getSession} from '~/session';
import type {Transaction} from '../domain/Transaction';

export async function loader({request}: LoaderFunctionArgs) {
    let {data} = await getSession(request.headers.get('cookie'));
    const {userInfo} = data;
    const role = userInfo?.role;
    const userId = userInfo?.userId;

    if (!role) {
        return redirect('/signin');
    }

    const {balance} = await getUser(userId);

    const transactions = await getUserTransactions(userId);

    return {userId, balance, transactions};
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();

    const data = Object.fromEntries(formData);

    const {userId, amount, description} = data;

    if (
        typeof userId !== 'string' ||
        typeof amount !== 'string' ||
        typeof description !== 'string'
    ) {
        throw new Error('boom');
    }

    await updateBalance({userId, amount: parseFloat(amount), description});

    return {message: 'complete'};
}

export interface UserSummaryDetails {
    transactions: Transaction[];
    userId: string;
    balance: string;
}

export default function Page() {
    const {transactions, balance} = useLoaderData<UserSummaryDetails>();

    return (
        <>
            <p>Balance: {balance}</p>
            <UserSummaryTable transactions={transactions} />
        </>
    );
}
