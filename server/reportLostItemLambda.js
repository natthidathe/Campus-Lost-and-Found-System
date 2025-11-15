// server/reportLostItemLambda.js
const { dynamoDB, TABLE_NAME, ITEM_PREFIX, CAT_PREFIX, STATUS_PREFIX, DATE_PREFIX, uuidv4 } = require('./db');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { itemName, description, dateLost, location, category } = body;
        
        // Validation
        if (!itemName || !description || !dateLost || !category) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields.' }) };
        }
        
        // Key Generation & Setup
        const reporterId = event.requestContext.authorizer.claims.sub || 'anonymous-user'; 
        const itemId = uuidv4();
        const nowTimestamp = Date.now();
        const status = 'LOST'; 

        const item = {
            // Primary Keys
            PK: ITEM_PREFIX + itemId,
            SK: ITEM_PREFIX + itemId,

            // GSI 1 Keys (GSI_SearchFilter)
            'GSI1-PK': CAT_PREFIX + category,
            'GSI1-SK': STATUS_PREFIX + status + '#' + nowTimestamp, 

            // GSI 2 Keys (GSI_MatchingEngine)
            'GSI2-PK': STATUS_PREFIX + status, 
            'GSI2-SK': DATE_PREFIX + nowTimestamp, 

            // Other Attributes
            itemId, itemName, description, dateReported: nowTimestamp,
            dateLostOrFound: new Date(dateLost).getTime(),
            Location: location, Category: category, ReporterId: reporterId,
            Status: status, isLost: true,
        };

        await dynamoDB.put({ TableName: TABLE_NAME, Item: item }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Lost item reported successfully', itemId }),
        };
    } catch (error) {
        console.error('Error reporting lost item:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error.' }) };
    }
};