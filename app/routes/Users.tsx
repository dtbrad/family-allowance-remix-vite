import {type ActionFunctionArgs, type MetaFunction} from '@remix-run/node';
import {useFetcher, useLoaderData} from '@remix-run/react';
import NewUserForm from '~/components/NewUserForm';
import UsersTable from '~/components/UsersTable';
import getUsers from '~/db/getUsers';
import generatePassword from '~/helpers/generatePassword';
import addUserRecord from '../db/addUser';
import type {User} from '../domain/User';
import '../globals.css';

export const meta: MetaFunction = () => {
    return [
        {title: 'Family Allowance'},
        {name: 'description', content: 'Welcome to Family Allowance'}
    ];
};

export async function loader() {
    const users = await getUsers();

    return users.map(({passwordDigest, ...user}) => user);
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();

    const {name, password, dayPreference, amount} =
        Object.fromEntries(formData);

    if (
        typeof name !== 'string' ||
        typeof password !== 'string' ||
        typeof dayPreference !== 'string' ||
        typeof amount !== 'string'
    ) {
        throw new Error('boom');
    }

    await addUserRecord({
        userId: name,
        passwordDigest: generatePassword(password),
        allowanceAmount: amount,
        dayPreference
    });

    return {message: 'complete'};
}

export default function Users() {
    let users = useLoaderData<User[]>();
    let fetcher = useFetcher();

    return (
        <>
            <UsersTable users={users} />
            <NewUserForm fetcher={fetcher} />
        </>
    );
}
