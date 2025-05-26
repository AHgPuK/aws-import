const COLOR = {
	red: '\033[31m',
	green: '\033[32m',
	yellow: '\033[33m',
	blue: '\033[34m',
	cyan: '\033[36m',
	magenta: '\033[35m',
	white: '\033[37m',
	black: '\033[30m',
	gray: '\033[90m',
	brightRed: '\033[91m',
	brightGreen: '\033[92m',
	brightYellow: '\033[93m',
	brightBlue: '\033[94m',
	brightCyan: '\033[96m',
	brightMagenta: '\033[95m',
	brightWhite: '\033[97m',
	brightBlack: '\033[90m',
	reset: '\033[0m',
}

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
	${COLOR.gray}# Import an array of items from JSON file to localstack DynamoDB
	# endpoint is optional, if not specified, it will use the default localstack endpoint${COLOR.reset}
	aws-import file=your.json region=eu-west-1 endpoint=http://localhost:4566
	${COLOR.gray}# Import an array of items from JSON file to DynamoDB from AWS console to the table specified as parameter${COLOR.reset}
	aws-import file=your.json table=my-table
	${COLOR.gray}# Convert your.json to batch files with 25 (default value) items each (Exported to the current directory)${COLOR.reset}
	aws-import file=your.json split=25
	${COLOR.gray}# Convert your.json to cleaned JSON file (Exported to the current directory)${COLOR.reset}
	aws-import file=your.json json=clean
	${COLOR.gray}# To get help (This message)${COLOR.reset}
	aws-import help
`,
	NO_JSON_FOUND: `No any JSON file found in the current directory`,
	MULTIPLE_JSON_FOUND: `Multiple JSON files found in the current directory`,
	OPTION_TABLE_SHOULD_BE_SPECIFIED: `Option "table' should be specified as parameter to import an array of items\n. Or specify a table name in JSON file.`,
	NO_ITEMS_FOUND: `No items found in the JSON file`,
}