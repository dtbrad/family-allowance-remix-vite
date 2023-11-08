import {Transaction} from '../domain/Transaction';
import styles from './UserSummaryTable.module.css';
import {format} from 'date-fns';
import {useState} from 'react';

interface GetTransactionsForPageParams {
    transactionEntries: Transaction[];
    currentPage: number;
}

function getTransactionsForPage({
    transactionEntries,
    currentPage
}: GetTransactionsForPageParams) {
    const startIndex = currentPage === 1 ? 0 : (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const itemsToDisplay = transactionEntries.slice(startIndex, endIndex);
    return itemsToDisplay;
}

const formatNum = (num: number) =>
    num?.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });

export default function UserSummaryTable({
    transactions
}: {
    transactions: Transaction[];
}) {
    const [currentPage, setCurrentPage] = useState(1);

    const transactionsToDisplay = getTransactionsForPage({
        transactionEntries: transactions,
        currentPage
    });

    return (
        <div className={styles.userSummary}>
            <div className={styles.tableSection}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr className={styles.usersTableHeader}>
                            <th className={styles.usersTableCell}>Date</th>
                            <th className={styles.usersTableCell}>Amount</th>
                            <th className={styles.usersTableCell}>
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionsToDisplay.map(
                            ({date, amount, description}) => (
                                <tr key={date}>
                                    <td className={styles.usersTableCell}>
                                        {format(
                                            new Date(date),
                                            'MMMM dd, yyyy'
                                        )}
                                    </td>
                                    <td className={styles.usersTableCell}>
                                        {formatNum(amount)}
                                    </td>
                                    <td className={styles.usersTableCell}>
                                        {description}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
            {transactions.length > 10 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.paginationButton}
                        disabled={currentPage < 2}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        prev
                    </button>
                    <div className={styles.currentPage}>{currentPage}</div>
                    <button
                        className={styles.paginationButton}
                        disabled={currentPage >= transactions.length / 10}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        next
                    </button>
                </div>
            )}
        </div>
    );
}
