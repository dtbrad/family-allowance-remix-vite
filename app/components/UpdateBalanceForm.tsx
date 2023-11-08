import {FetcherWithComponents} from '@remix-run/react';
import styles from './UpdateBalanceForm.module.css';
import {useEffect, useRef} from 'react';

export default function UpdateBalanceForm({
    fetcher,
    balance,
    userId
}: {
    fetcher: FetcherWithComponents<unknown>;
    balance: string;
    userId: string;
}) {
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
        <div className={styles.updateBalanceForm}>
            <p className={styles.balance}>Balance: {balance}</p>
            <fetcher.Form
                method="post"
                ref={formRef}
                className={styles.formSection}
            >
                <fieldset
                    className={styles.formSection}
                    disabled={fetcher.state !== 'idle'}
                >
                    <input
                        type="hidden"
                        id="userId"
                        name="userId"
                        value={userId}
                    />
                    <input id="amount" name="amount" placeholder="amount" />
                    <input
                        id="description"
                        name="description"
                        placeholder="description"
                    />
                    <button type="submit">
                        {fetcher.state === 'idle' ? 'Save' : 'Saving'}
                    </button>
                </fieldset>
            </fetcher.Form>
        </div>
    );
}
