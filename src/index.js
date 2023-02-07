const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();


async function getFn()  {
    const params = {
        TableName: 'Cloud-Resume-Challenge-Visitor',
        Key: {
            ID: "visitors"
        },
        UpdateExpression: 'set CounterValue = CounterValue + :val',
        ExpressionAttributeValues: {
            ':val': 1
        },
        ReturnValues: 'UPDATED_NEW',
        
    };

   
    
    try {
        const valUpdate = await dynamoDB.update(params).promise();
        const response = await dynamoDB.get(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(response),
            headers: {
                "access-control-allow-origin" : "*"
              }
        };
    } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            console.log('Item does not exist, creating it');
            // create the item here
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify(err)
            };
        }
    }
    
};


module.exports = {getFn}