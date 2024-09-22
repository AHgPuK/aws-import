const FS = require('fs');

module.exports = function (config) {

	const {file, table } = config;

	const fileName = file.split('.')[0];

	let sequence = 0;

	const updater = async function (batch, isDelete) {
		sequence++;
		const bulkData = {
			[table]: batch,
		}

		const sequenceFileName = `${fileName}-${String(sequence).padStart(3, '0')}.json`;
		FS.writeFileSync(sequenceFileName, JSON.stringify(bulkData, null, 2));
		console.log('Batch written:', batch.length);
	}

	return updater;
}

