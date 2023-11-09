import {type LoaderFunctionArgs} from '@remix-run/node';
import {Form, Outlet, useLoaderData} from '@remix-run/react';
import {getSession} from '~/session';
import styles from './_auth.module.css';

export async function loader({request}: LoaderFunctionArgs) {
    let {data} = await getSession(request.headers.get('cookie'));
    const {userInfo} = data;
    const role = userInfo?.role;
    const userId = userInfo?.userId;

    return {userId, role};
}

export default function AuthLayout() {
    const {userId, role} = useLoaderData<typeof loader>();

    return (
        <div>
            <nav className={styles.navigation}>
                <h1 className={styles.title}>Allowance Controls</h1>
                <Form method="post" className={styles.signinToggle}>
                    <div className={styles.loggedInUser}>
                        Signed in as: {userId}
                    </div>
                    <button>Sign Out</button>
                </Form>
            </nav>
            <div className={styles.body}>
                <Outlet />
            </div>
        </div>
    );
}
