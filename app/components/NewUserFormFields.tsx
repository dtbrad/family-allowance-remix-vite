import styles from './NewUserFormFields.module.css';

export default function NewUserFormFields({
    fetcherStatus
}: {
    fetcherStatus: 'submitting' | 'idle' | 'loading';
}) {
    return (
        <fieldset
            className={styles.formContent}
            disabled={fetcherStatus === 'submitting'}
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
                {fetcherStatus === 'submitting' ? 'Saving' : 'Save'}
            </button>
        </fieldset>
    );
}
