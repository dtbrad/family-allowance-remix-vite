import {dynamo} from './dynamo';

const tableName = process.env.TABLE_NAME!;

export interface TransactionDbItem {
    amount: number;
    description: string;
    SK: string;
}

export default async function getUserTransactions(userId: string) {
    const result = await dynamo
        .query({
            TableName: tableName,
            KeyConditionExpression: 'PK = :value',
            ExpressionAttributeValues: {
                ':value': userId
            },
            ScanIndexForward: false
        })
        .promise();

    const items = result?.Items?.filter(
        (item) => !item.allowanceAmount
    ) as TransactionDbItem[];

    return items.map(({amount, description, SK}) => ({
        amount,
        description,
        date: SK
    }));
}
