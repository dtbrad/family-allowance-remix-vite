import {
    redirect,
    type ActionFunctionArgs,
    type LoaderFunctionArgs
} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import UserSummaryTable from '~/components/UserSummaryTable';
import getUser from '~/db/getUser';
import getUserTransactions from '~/db/getUserTransactions';
import updateBalance from '~/db/updateBalance';
import {Role} from '~/domain/Role';
import type {Transaction} from '~/domain/Transaction';
import {getSession} from '~/session';

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
    let {data} = await getSession(request.headers.get('cookie'));
    const {userInfo} = data;
    const role = userInfo?.role;

    if (role !== Role.admin) {
        throw new Response('Not allowed', {status: 401});
    }

    const formData = await request.formData();

    const formDataEntries = Object.fromEntries(formData);

    const {userId, amount, description} = formDataEntries;

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
