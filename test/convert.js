const convert = require('../lib/json2dyn.js');

const tests = [
	{
		"string": "string",
		"number": 123,
		"boolean": true,
		"array": [1, 2, 3],
		"object": {
			"key": "value"
		},
	}
]

Promise.resolve()
.then(function () {

	for (const test of tests)
	{
		const result = convert(test);
		console.log(JSON.stringify(result, null, 2));
	}

})
.catch(err => {
	console.error(err);
})

