import {dynamo} from './dynamo';

const tableName = process.env.TABLE_NAME || '';

export default async function deleteUser(userId: string) {
    const userQueryResponse = await dynamo
        .query({
            TableName: tableName,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': userId
            }
        })
        .promise();

    if (!userQueryResponse?.Items) {
        return;
    }

    await Promise.all(
        userQueryResponse.Items.map(async (item) => {
            await dynamo
                .delete({
                    TableName: process.env.TABLE_NAME!,
                    Key: {PK: item.PK, SK: item.SK}
                })
                .promise();
        })
    );
}
