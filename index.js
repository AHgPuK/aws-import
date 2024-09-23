#!/usr/bin/env node

const FS = require('fs');
const DynamoDbUtils = require('@aws-sdk/util-dynamodb');

const Config = require('./lib/config.js');
const {BulkUpdate} = require('./lib/bulk.js');
const Json2Dyn = require('./lib/json2dyn.js');
const Dyn2Json = require('./lib/dyn2json.js');

const {
	AWS_HELP,
	USAGE,
	NO_JSON_FOUND,
	MULTIPLE_JSON_FOUND,
	OPTION_TABLE_SHOULD_BE_SPECIFIED,
	NO_ITEMS_FOUND,
} = require('./lib/constants.js');

Promise.resolve()
.then(async () => {

	const config = Config(process.argv);

	if (config.help)
	{
		console.log()
	}

	let {file = '', region = '', endpoint = '', split} = config;

	if (!file)
	{
		const jsonCandidates = FS.readdirSync('./').filter(file => {
			return file.endsWith('.json') && file !== 'package.json';
		});
		if (jsonCandidates.length === 0)
		{
			console.log(NO_JSON_FOUND);
			console.log(USAGE);
			return;
		}
		else if (jsonCandidates.length > 1)
		{
			throw new Error(MULTIPLE_JSON_FOUND);
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

	let items = Dyn2Json(data);

	if (!(items?.length > 0))
	{
		items = data;

		if (Array.isArray(data))
		{
			if (!config.table)
			{
				throw new Error(`${OPTION_TABLE_SHOULD_BE_SPECIFIED}\n${AWS_HELP}`);
			}
		}
	}

	if (!(items?.length > 0))
	{
		throw new Error(`${NO_ITEMS_FOUND}\n${AWS_HELP}`);
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
		// try
		// {
		// 	cleanJson = DynamoDbUtils.unmarshall(item, {
		// 		convertClassInstanceToMap: true,
		// 	});
		// }
		// catch (err)
		// {
		// 	// console.error(err);
		// }

		const dataItem = config.json === 'clean' ? item : Json2Dyn(item);
		await bulk.add(dataItem);
	}

	await bulk.end();

})
.catch(err => {
	console.error(err);
});
