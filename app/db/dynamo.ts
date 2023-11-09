import AWS from 'aws-sdk';

export const dynamo = new AWS.DynamoDB.DocumentClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_KEY!
    },
    region: process.env.REGION
});
