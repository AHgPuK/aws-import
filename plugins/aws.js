module.exports = function (config) {
	const {DynamoDBClient, BatchWriteItemCommand} = require("@aws-sdk/client-dynamodb");

	const { table, region, endpoint } = config;

	const db = new DynamoDBClient({
		endpoint: endpoint,
		region: region || 'eu-west-1',
	});

	const updater = async function (batch, isDelete) {

		const bulkData = {
			RequestItems: {
				[table]: batch,
			}
		}

		const command = new BatchWriteItemCommand(bulkData);
		const response = await db.send(command);

		console.log('Batch written:', batch.length);
	}

	return updater;
}
