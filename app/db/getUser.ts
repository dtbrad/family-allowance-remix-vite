import {dynamo} from './dynamo';
import type {User} from '../domain/User';

export default async function getUser(userId: string) {
    const {Item} = await dynamo
        .get({
            TableName: process.env.TABLE_NAME!,
            Key: {PK: userId, SK: userId}
        })
        .promise();

    return Item as User;
}
