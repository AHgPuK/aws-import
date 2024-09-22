#!/usr/bin/env node

const FS = require('fs');

const {DynamoDBClient, BatchWriteItemCommand} = require("@aws-sdk/client-dynamodb");

const Config = require('./config.js');
const {BulkUpdate} = require('./lib/bulk.js');
const Json2Dyn = require('./lib/json2dyn.js');

const AWS_HELP = `About a format of json file see:
https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchWriteItemCommand/`;

Promise.resolve()
.then(async () => {

	const config = Config(process.argv);
	let {file = '', region = '', endpoint = '', split} = config;

	if (!file)
	{
		const jsonCandidates = FS.readdirSync('./').filter(file => {
			return file.endsWith('.json') && file !== 'package.json';
		});
		if (jsonCandidates.length === 0)
		{
			console.log('No any JSON file found in the current directory');
			console.log('Usage:');
			console.log('    aws-import file=your.json region=eu-west-1 endpoint=http://localhost:4566');
			console.log('    aws-import file=your.json table=my-table');
			console.log('    aws-import file=your.json split[=25]');
			return;
		}
		else if (jsonCandidates.length > 1)
		{
			throw new Error('Multiple JSON files found in the current directory');
		}
		else
		{
			file = jsonCandidates[0];
			config.file = file;
		}
	}
	else
	{
		if (!region)
		{
			if (!file.endsWith('.json'))
			{
				region = file;
			}
		}
	}

	const content = FS.readFileSync(file, 'utf8');
	const data = JSON.parse(content);
	const table = Object.keys(data)?.[0];

	if (!table)
	{
		throw new Error(`No table found in the JSON file: ${file}\n${AWS_HELP}`);
	}

	let items = data[table];

	if (!(items?.length > 0))
	{
		items = data;

		if (Array.isArray(data))
		{
			if (!config.table)
			{
				throw new Error(`Option "table' should be specified as parameter to import an array of items\n. Or specify a table name in JSON file.\n${AWS_HELP}`);
			}
		}
	}

	if (!(items?.length > 0))
	{
		throw new Error(`No items found in the JSON file\n${AWS_HELP}`);
	}

	config.table = config.table || table;
	let updateFunc = null;

	if (split)
	{
		console.log('Splitting into files');
		const Splitter = require('./plugins/split.js');
		updateFunc = Splitter(config);
	}
	else
	{
		console.log('Import to the database');
		const AwsImport = require('./plugins/aws.js');
		updateFunc = AwsImport(config);
	}

	const bulk = BulkUpdate({
		max: split || 25, // Limitation of awslocal DynamoDB batchWriteItem
		updateDb: updateFunc,
	});

	for (const item of items)
	{
		const dynJson = Json2Dyn(item);
		await bulk.add(dynJson);
	}

	await bulk.end();

})
.catch(err => {
	console.error(err.message);
});
