	const { DYNAMODB_PROPS, DYNAMODB_TYPES } = require('./constants');

const DYN_PROPS = {
	S: {
		to: (obj) => String(obj),
	},
	N: {
		to: (obj) => Number(obj),
	},
	BOOL: {
		to: (obj) => obj === 'true',
	},
	L: {
		to: (obj) => obj.map(stripDynJSON),
	},
}

const isPrimitive = function (item) {
	// Test if item is not an object
	if (item !== Object(item))
	{
		return true;
	}
	return false;
}

const stripDynJSON = function (item) {

	if (isPrimitive(item))
	{
		return item;
	}

	const keys = Object.keys(item);
	if (keys.length === 1 && keys[0] in DYN_PROPS)
	{
		const key = keys[0];
		return DYN_PROPS[key].to(item[key]);
	}

	const stripped = {};
	for (const key in item)
	{
		stripped[key] = stripDynJSON(item[key]);
	}

	return stripped;
}

const getJsonRoot = function (item) {
	if (isPrimitive(item)) return item;

	while (item) {
		const keys = Object.keys(item);
		const firstKey = keys?.[0];
		if (DYNAMODB_PROPS.has(firstKey) && keys.length === 1) {
			item = item[firstKey];
			continue;
		}
		break;
	}

	return item;
}

module.exports = function (obj) {

	while (Array.isArray(obj) == false)
	{
		if (obj == null) break;
		obj = Object.values(obj)[0];
	}

	if (!obj)
	{
		throw new Error(`No items found in the JSON file\n${AWS_HELP}`);
	}

	const data = obj.map((item) => {
		return stripDynJSON(getJsonRoot(item));
	});

	return data;
}

if (require.main === module)
{
	const data = {
		"Items": [
			{
				"Id": {
					"S": "1"
				},
				"Name": {
					"S": "John"
				},
				"Age": {
					"N": "25"
				},
				"Active": {
					"BOOL": "true"
				},
				"Children": {
					"L": [
						{
							"S": "Alice"
						},
						{
							"S": "Bob"
						}
					]
				}
			}
		]
	};

	console.log(JSON.stringify(module.exports(data), null, 2));
}
