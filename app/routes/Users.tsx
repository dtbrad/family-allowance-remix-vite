import {type MetaFunction, type ActionFunctionArgs} from '@remix-run/node';
import '../globals.css';
import {useFetcher, useLoaderData} from '@remix-run/react';
import addUserRecord from '../db/addUser';
import generatePassword from '~/helpers/generatePassword';
import {useEffect, useRef} from 'react';
import getUsers from '~/db/getUsers';
import type {User} from '../domain/User';
import UsersTable from '~/components/UsersTable';
import NewUserFormFields from '~/components/NewUserFormFields';

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
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(
        function () {
            if (fetcher.state === 'idle') {
                formRef.current?.reset();
            }
        },
        [fetcher.state]
    );

    return (
        <>
            <UsersTable users={users} />
            <fetcher.Form method="post" ref={formRef}>
                <NewUserFormFields fetcherStatus={fetcher.state} />
            </fetcher.Form>
        </>
    );
}
