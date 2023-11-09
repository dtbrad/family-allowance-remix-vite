import {
    type LoaderFunctionArgs,
    type ActionFunctionArgs,
    type MetaFunction,
    redirect
} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import NewUserForm from '~/components/NewUserForm';
import UsersTable from '~/components/UsersTable';
import getUsers from '~/db/getUsers';
import generatePassword from '~/helpers/generatePassword.server';
import addUserRecord from '../db/addUser';
import type {User} from '../domain/User';
import deleteUser from '~/db/deleteUser';
import {getSession} from '~/session';
import {Role} from '~/domain/Role';

export const meta: MetaFunction = () => {
    return [
        {title: 'Family Allowance'},
        {name: 'description', content: 'Welcome to Family Allowance'}
    ];
};

export async function loader({request}: LoaderFunctionArgs) {
    let {data} = await getSession(request.headers.get('cookie'));
    const {userInfo} = data;
    const role = userInfo?.role;

    if (role === Role.standard) {
        return redirect('/summary');
    }

    if (!role) {
        return redirect('/signin');
    }

    const users = await getUsers();

    return users.map(({passwordDigest, ...user}) => user);
}

export async function action({request, params}: ActionFunctionArgs) {
    const formData = await request.formData();

    const {
        name,
        password,
        dayPreference,
        amount,
        formSubmit,
        userIdForDeletion
    } = Object.fromEntries(formData);

    if (formSubmit === 'delete') {
        await deleteUser(userIdForDeletion as string);

        return {message: 'deleted'};
    }

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

    return (
        <>
            <UsersTable users={users} />
            <NewUserForm />
        </>
    );
}
