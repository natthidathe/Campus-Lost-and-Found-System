// server/reportFoundItemLambda.js
const { dynamoDB, TABLE_NAME, ITEM_PREFIX, CAT_PREFIX, STATUS_PREFIX, DATE_PREFIX, uuidv4 } = require('./db');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { itemName, description, dateFound, location, category, ImageS3Key, officeNotes } = body;

        // Validation: ImageS3Key is required for Found items
        if (!itemName || !ImageS3Key || !category) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Missing Name, ImageS3Key, or Category.' }) };
        }
        
        // Key Generation & Setup
        const reporterId = event.requestContext.authorizer.claims.sub || 'office-staff';
        const itemId = uuidv4();
        const nowTimestamp = Date.now();
        const status = 'FOUND'; 

        const item = {
            // Primary Keys
            PK: ITEM_PREFIX + itemId, SK: ITEM_PREFIX + itemId,

            // GSI 1 Keys (GSI_SearchFilter)
            'GSI1-PK': CAT_PREFIX + category, 
            'GSI1-SK': STATUS_PREFIX + status + '#' + nowTimestamp, 

            // GSI 2 Keys (GSI_MatchingEngine)
            'GSI2-PK': STATUS_PREFIX + status, 
            'GSI2-SK': DATE_PREFIX + nowTimestamp, 

            // Other Attributes
            itemId, itemName, description, dateReported: nowTimestamp,
            dateLostOrFound: new Date(dateFound).getTime(),
            Location: location, Category: category, ImageS3Key, OfficeNotes: officeNotes,
            ReporterId: reporterId,
            Status: status, isLost: false,
        };

        await dynamoDB.put({ TableName: TABLE_NAME, Item: item }).promise();
        return { statusCode: 201, body: JSON.stringify({ message: 'Found item reported successfully', itemId }) };
    } catch (error) {
        console.error('Error reporting found item:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error.' }) };
    }
};