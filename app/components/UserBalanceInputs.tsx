import {User} from '../domain/User';
import styles from './UserBalanceInputs.module.css';
import {useEffect, useRef, useState} from 'react';
import {Status} from '../domain/Status';

export default function UserBalanceInputs({
    userId,
    fetcherStatus
}: {
    userId: string;
    fetcherStatus: 'submitting' | 'idle' | 'loading';
}) {
    return (
        <fieldset
            className={styles.formSection}
            disabled={fetcherStatus !== 'idle'}
        >
            <input type="hidden" id="userId" name="userId" value={userId} />
            <input id="amount" name="amount" placeholder="amount" />
            <input
                id="description"
                name="description"
                placeholder="description"
            />
            <button type="submit">
                {fetcherStatus === 'idle' ? 'Save' : 'Saving'}
            </button>
        </fieldset>
    );
}
