// server/searchItemsLambda.js
const { dynamoDB, TABLE_NAME, CAT_PREFIX, STATUS_PREFIX } = require('./db');

exports.handler = async (event) => {
    try {
        const { status, category, keywords } = event.queryStringParameters || {};
        let params = { 
            TableName: TABLE_NAME, 
            ProjectionExpression: "itemId, itemName, Category, Location, ImageS3Key, dateLostOrFound, Status, description" 
        };

        if (category) {
            // Use GSI 1 (GSI_SearchFilter) for combined category/status filtering
            params.IndexName = 'GSI_SearchFilter';
            params.KeyConditionExpression = '#gsi1pk = :catVal';
            params.ExpressionAttributeNames = { '#gsi1pk': 'GSI1-PK' };
            params.ExpressionAttributeValues = { ':catVal': CAT_PREFIX + category };

            if (status) {
                params.KeyConditionExpression += ' AND begins_with(#gsi1sk, :statVal)';
                params.ExpressionAttributeNames['#gsi1sk'] = 'GSI1-SK';
                params.ExpressionAttributeValues[':statVal'] = STATUS_PREFIX + status;
            }
        } else {
            // Use GSI 2 (GSI_MatchingEngine) for general status queries, sorted by date
            params.IndexName = 'GSI_MatchingEngine';
            params.KeyConditionExpression = '#gsi2pk = :statVal';
            params.ExpressionAttributeNames = { '#gsi2pk': 'GSI2-PK' };
            params.ExpressionAttributeValues = { ':statVal': STATUS_PREFIX + (status || 'FOUND') };
            params.ScanIndexForward = false; // Newest first
        }
        
        // Keyword Search (FilterExpression)
        if (keywords) {
            params.FilterExpression = 'contains(itemName, :k) OR contains(description, :k)';
            params.ExpressionAttributeValues[':k'] = keywords;
        }

        const result = await dynamoDB.query(params).promise();

        return { statusCode: 200, body: JSON.stringify(result.Items) };
    } catch (error) {
        console.error('Error searching items:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error.' }) };
    }
};