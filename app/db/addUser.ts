import {dynamo} from './dynamo';
import 'dotenv/config';

const tableName = process.env.TABLE_NAME || '';

export interface AddUserParams {
    userId: string;
    passwordDigest: string;
    allowanceAmount: string;
    dayPreference: string;
}

export default async function addUser({
    userId,
    passwordDigest,
    allowanceAmount,
    dayPreference
}: AddUserParams) {
    const lowerCaseUserId = userId.toLowerCase();

    await dynamo
        .put({
            TableName: tableName,
            Item: {
                PK: lowerCaseUserId,
                SK: lowerCaseUserId,
                role: 'standard',
                passwordDigest,
                allowanceAmount,
                dayPreference,
                balance: 0,
                userId: lowerCaseUserId
            },
            ConditionExpression: 'attribute_not_exists(PK)'
        })
        .promise();
}
