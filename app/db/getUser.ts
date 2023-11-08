import {dynamo} from './dynamo';
import {User} from '../domain/User';
import 'dotenv/config';

export default async function getUser(userId: string) {
    const {Item} = await dynamo
        .get({
            TableName: process.env.TABLE_NAME!,
            Key: {PK: userId, SK: userId}
        })
        .promise();

    return Item as User;
}
