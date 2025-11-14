// server/getItemDetailsLambda.js
const { dynamoDB, TABLE_NAME, ITEM_PREFIX } = require('./db');

exports.handler = async (event) => {
    try {
        const itemId = event.pathParameters.id; 
        
        const params = {
            TableName: TABLE_NAME,
            Key: {
                // Use the primary PK/SK for fast lookup
                'PK': ITEM_PREFIX + itemId,
                'SK': ITEM_PREFIX + itemId,
            }
        };

        const result = await dynamoDB.get(params).promise();

        if (!result.Item) {
            return { statusCode: 404, body: JSON.stringify({ message: 'Item not found.' }) };
        }

        return { statusCode: 200, body: JSON.stringify(result.Item) };
    } catch (error) {
        console.error('Error getting item details:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error.' }) };
    }
};