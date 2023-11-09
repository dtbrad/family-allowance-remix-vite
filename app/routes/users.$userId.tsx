import {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import {Link, useLoaderData} from '@remix-run/react';
import UpdateBalanceForm from '~/components/UpdateBalanceForm';
import UserSummaryTable from '~/components/UserSummaryTable';
import getUser from '~/db/getUser';
import getUserTransactions from '~/db/getUserTransactions';
import updateBalance from '~/db/updateBalance';
import {Transaction} from '../domain/Transaction';

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

    return (
        <>
            <Link to={'/users'}>Back to Users</Link>
            <UpdateBalanceForm userId={userId} balance={balance} />
            <UserSummaryTable transactions={transactions} />
        </>
    );
}
