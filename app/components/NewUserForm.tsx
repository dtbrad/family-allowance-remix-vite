import {FetcherWithComponents, useFetcher} from '@remix-run/react';
import styles from './NewUserForm.module.css';
import {useEffect, useRef} from 'react';

export default function NewUserFormFields() {
    const formRef = useRef<HTMLFormElement>(null);
    const fetcher = useFetcher();

    useEffect(
        function () {
            if (fetcher.state === 'idle') {
                formRef.current?.reset();
            }
        },
        [fetcher.state]
    );

    return (
        <fetcher.Form method="post" ref={formRef}>
            <fieldset
                className={styles.formContent}
                disabled={fetcher.state !== 'idle'}
            >
                <h2>Create a User</h2>
                <input required type="text" name="name" placeholder="name" />
                <input
                    required
                    type="text"
                    name="password"
                    placeholder="password"
                />
                <input type="text" name="amount" placeholder="amount" />
                <label htmlFor="weekday-select">Choose a day:</label>
                <select
                    required
                    name="dayPreference"
                    id="weekday-select"
                    defaultValue=""
                >
                    <option value="" disabled>
                        --Please choose an option--
                    </option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select>
                <button type="submit">
                    {fetcher.state === 'idle' ? 'Save' : 'Saving'}
                </button>
            </fieldset>
        </fetcher.Form>
    );
}
