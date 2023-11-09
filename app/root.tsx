import {cssBundleHref} from '@remix-run/css-bundle';
import {
    redirect,
    type ActionFunctionArgs,
    type LinksFunction
} from '@remix-run/node';
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from '@remix-run/react';
import './globals.css';
import {destroySession, getSession} from './session';

export const links: LinksFunction = () => [
    ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : [])
];

export async function action({request}: ActionFunctionArgs) {
    let session = await getSession(request.headers.get('cookie'));

    return redirect('/signin', {
        headers: {
            'Set-Cookie': await destroySession(session)
        }
    });
}

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
