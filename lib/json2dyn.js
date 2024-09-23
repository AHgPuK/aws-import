const { DYNAMODB_PROPS, DYNAMODB_TYPES } = require('./constants');

const convert = (json, isRoot = true) => {

	if (isRoot)
	{
		if (!json) return;

		const keys = Object.keys(json);
		const firstKey = keys?.[0];
		if (DYNAMODB_PROPS.has(firstKey))
		{
			return json;
		}
	}

	if (json === null || json === undefined)
	{
		return {
			"NULL": true
		}
	}

	if (typeof json === 'string')
	{
		return {
			"S": json
		}
	}

	if (typeof json === 'number')
	{
		return {
			"N": json.toString()
		}
	}

	if (typeof json === 'boolean')
	{
		return {
			"BOOL": json
		}
	}

	if (Array.isArray(json))
	{
		return {
			"L": json.map(item => {
				return convert(item, false);
			})
		}
	}

	const keys = Object.keys(json);

	if (keys.length === 1 && DYNAMODB_TYPES.has(keys[0]))
	{
		return json;
	}

	let obj = {};
	for (const key in json)
	{
		obj[key] = convert(json[key], false);
	}

	if (isRoot)
	{
		return {
			PutRequest: {
				Item: obj
			}
		}
	}

	return {
		"M": obj
	}

}

module.exports = convert;
