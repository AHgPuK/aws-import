module.exports = {
	DYNAMODB_PROPS: new Set([
		'Item',
		'PutRequest',
		'DeleteRequest',
		'UpdateItem',
	]),
	DYNAMODB_TYPES: new Set([
		'S',
		'N',
		'B',
		'L',
		'M',
		'NULL',
		'BOOL',
	]),

	AWS_HELP: `About a format of json file see:
https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchWriteItemCommand/`,
	USAGE: `Usage:
	aws-import file=your.json region=eu-west-1 endpoint=http://localhost:4566
	aws-import file=your.json table=my-table
	aws-import file=your.json split[=25]
	aws-import file=your.json json=clean
	aws-import help
`,
	NO_JSON_FOUND: `No any JSON file found in the current directory`,
	MULTIPLE_JSON_FOUND: `Multiple JSON files found in the current directory`,
	OPTION_TABLE_SHOULD_BE_SPECIFIED: `Option "table' should be specified as parameter to import an array of items\n. Or specify a table name in JSON file.`,
	NO_ITEMS_FOUND: `No items found in the JSON file`,
}