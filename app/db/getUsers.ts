import {dynamo} from './dynamo';
import type {User} from '../domain/User';

export default async function getUsers() {
    const result = await dynamo
        .scan({
            TableName: process.env.TABLE_NAME!,
            IndexName: 'userIdIndex'
        })
        .promise();

    return result.Items as User[];
}
