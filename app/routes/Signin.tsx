import styles from './signin.module.css';
import {
    type ActionFunctionArgs,
    type MetaFunction,
    type LoaderFunctionArgs,
    redirect
} from '@remix-run/node';
import getUser from '~/db/getUser';
import {commitSession, getSession} from '../session';
import {Form, useLoaderData} from '@remix-run/react';
import hasher from '~/helpers/hasher.server';
import {Role} from '~/domain/Role';

export const meta: MetaFunction = () => {
    return [
        {title: 'Family Allowance'},
        {name: 'description', content: 'Welcome to Family Allowance'}
    ];
};

export async function action({request}: ActionFunctionArgs) {
    interface Hash {
        hashedPassword: string;
        salt: string;
    }

    function compare(password: string, hash: Hash) {
        const passwordData = hasher(password, hash.salt);

        return passwordData.hashedpassword === hash.hashedPassword;
    }

    function passwordsMatch(password: string, passwordDigest: string) {
        const cryptoSalt = process.env.CRYPTO_SALT;
        return compare(password, {
            salt: cryptoSalt!,
            hashedPassword: passwordDigest
        });
    }
    const formData = await request.formData();

    const {name, password} = Object.fromEntries(formData);

    if (typeof name !== 'string' || typeof password !== 'string') {
        throw new Error('boom');
    }

    const userFromDb = await getUser(name);

    if (!userFromDb) {
        return {message: 'failed to authenticate'};
    }

    const passwordsDoMatch = passwordsMatch(
        password,
        userFromDb.passwordDigest
    );

    if (userFromDb && passwordsDoMatch) {
        const userInfo = {userId: userFromDb.userId, role: userFromDb.role};

        let session = await getSession();
        session.set('userInfo', userInfo);

        const destination =
            userInfo.role === Role.admin ? '/users' : '/summary';

        return redirect(destination, {
            headers: {
                'Set-Cookie': await commitSession(session)
            }
        });
    }

    return {message: 'failed to authenticate'};
}

export async function loader({request}: LoaderFunctionArgs) {
    let {data} = await getSession(request.headers.get('cookie'));
    const {userInfo} = data;
    const role = userInfo?.role;

    if (role === Role.standard) {
        return redirect('/summary');
    }

    if (role === Role.admin) {
        return redirect('/users');
    }

    return null;
}

export default function SigninForm() {
    return (
        <div className={styles.signinPage}>
            <Form className={styles.signinCard} method="post">
                <div className={styles.signinTitle}>Log In</div>
                <div className={styles.inputGroup}>
                    <input
                        required
                        aria-label="user id"
                        className={styles.inputField}
                        name="name"
                        type="text"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <input
                        required
                        aria-label="password"
                        className={styles.inputField}
                        name="password"
                        type="password"
                    />
                </div>
                <button className={styles.signinButton} type="submit">
                    Sign In
                </button>
            </Form>
        </div>
    );
}
