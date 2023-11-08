import {Link, useFetcher, useLoaderData} from '@remix-run/react';
import getUser from '~/db/getUser';
import {Transaction} from '../domain/Transaction';
import {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import getUserTransactions from '~/db/getUserTransactions';
import UserSummaryTable from '~/components/UserSummaryTable';
import updateBalance from '~/db/updateBalance';
import {useEffect, useRef} from 'react';
import UserBalanceInputs from '~/components/UserBalanceInputs';
import UpdateBalanceForm from '~/components/UpdateBalanceForm';

export async function loader({params}: LoaderFunctionArgs) {
    const {userId} = params;

    if (!userId) {
        throw new Response('Not Found', {status: 404});
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
    const {transactions, userId, balance} = useLoaderData<UserSummaryDetails>();
    const fetcher = useFetcher();

    return (
        <>
            <Link to={'/users'}>Back to Users</Link>
            <UpdateBalanceForm
                fetcher={fetcher}
                userId={userId}
                balance={balance}
            />
            <UserSummaryTable transactions={transactions} />
        </>
    );
}
