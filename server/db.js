// server/db.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS Region (MUST BE SET TO YOUR DEPLOYMENT REGION)
AWS.config.update({ region: 'YOUR_AWS_REGION' }); 

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'CampusLostAndFound_Items';

// Define the prefixes used for Single-Table Design
const ITEM_PREFIX = 'ITEM#';
const CAT_PREFIX = 'CAT#';
const STATUS_PREFIX = 'STATUS#';
const DATE_PREFIX = 'DATE#';

module.exports = {
    dynamoDB,
    TABLE_NAME,
    ITEM_PREFIX,
    CAT_PREFIX,
    STATUS_PREFIX,
    DATE_PREFIX,
    uuidv4,
};