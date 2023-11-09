import {Link, useFetcher} from '@remix-run/react';
import type {User} from '../domain/User';
import styles from './UsersTable.module.css';
import UserListItem from './UserListItem';

export default function UsersTable({users}: {users: User[]}) {
    return (
        <div className={styles.userList}>
            <table className={styles.usersTable}>
                <thead>
                    <tr className={styles.usersTableHeader}>
                        <th className={styles.usersTableCell}>Name</th>
                        <th className={styles.usersTableCell}>Balance</th>
                        <th className={styles.usersTableCell}>Allowance</th>
                        <th className={styles.usersTableCell}>Day</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(
                        ({userId, balance, allowanceAmount, dayPreference}) => (
                            <tr key={userId}>
                                <td
                                    className={`${styles.usersTableCell} ${styles.nameCell}`}
                                >
                                    <UserListItem userId={userId} />
                                </td>
                                <td className={styles.usersTableCell}>
                                    {balance}
                                </td>
                                <td className={styles.usersTableCell}>
                                    {allowanceAmount}
                                </td>
                                <td className={styles.usersTableCell}>
                                    {dayPreference}
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}
