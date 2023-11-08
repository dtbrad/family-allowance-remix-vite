import {dynamo} from './dynamo';
import 'dotenv/config';

interface UpdateBalanceParams {
    userId: string;
    amount: number;
    transactionDate?: string;
    description?: string;
}

const tableName = process.env.TABLE_NAME!;

export default async function updateBalance({
    userId,
    amount,
    transactionDate = new Date().toISOString(),
    description = 'allowance'
}: UpdateBalanceParams) {
    console.log('INSIDE DB OPERATION');
    console.log({userId, amount, transactionDate, description});
    const params = {
        TransactItems: [
            {
                Put: {
                    TableName: tableName,
                    Item: {
                        PK: userId,
                        SK: transactionDate,
                        amount,
                        description
                    }
                }
            },
            {
                Update: {
                    TableName: tableName,
                    Key: {PK: userId, SK: userId},
                    UpdateExpression: 'ADD balance :amount',
                    ConditionExpression: 'PK = :userId And SK = :userId',
                    ExpressionAttributeValues: {
                        ':amount': amount,
                        ':userId': userId
                    },
                    ReturnValues: 'UPDATED_NEW'
                }
            }
        ]
    };

    try {
        await dynamo.transactWrite(params).promise();
    } catch (error) {
        throw new Error('Boom!!');
    }
}
