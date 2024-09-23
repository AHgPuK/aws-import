module.exports = function (args) {

	const OPTIONS = {
		file: '',
		region: '',
		endpoint: '',
		split: 0,
		table: '',
		json: '',
		help: '',
	}

	const DEFAULTS = {
		file: '',
		region: '',
		endpoint: '',
		split: 25,
		table: '',
		json: 'dynamo', // dynamo is DynamoDB Json object, raw is raw JSON
		help: 'show'
	}

	const config = structuredClone(OPTIONS);

	for (let i = 2; i < args.length; i++)
	{
		let [key, value] = args[i].split('=');

		if (key in config)
		{
			if (config[key].constructor === Number)
			{
				value = value | 0;
			}
			config[key] = value || DEFAULTS[key];
		}
		else
		{
			throw new Error(`Unknown argument: ${key}`);
		}
	}

	config.region = config.region || process.env.AWS_REGION || 'eu-west-1';

	if (!config.endpoint)
	{
		if (process.env.AWS_EXECUTION_ENV == 'CloudShell')
		{
			config.endpoint = `https://dynamodb.${config.region}.amazonaws.com`;
		}
		else
		{
			config.endpoint = 'http://localhost:4566';
		}
	}

	return config;
}
