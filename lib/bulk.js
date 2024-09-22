module.exports = {
	BulkUpdate: function({max, updateDb}) {

		let bulk = [];
		let isFirstRun = true;

		const end = async function() {
			if (bulk.length > 0)
			{
				let isDelete = isFirstRun;
				isFirstRun = false;
				const batch = bulk;
				bulk = [];

				await updateDb(batch, isDelete);
				// console.log(sqlRow);
			}
		}

		return {
			add: async function(query) {

				if (Array.isArray(query))
				{
					bulk = bulk.concat(query);
				}
				else
				{
					bulk.push(query);
				}

				if (bulk.length >= (max || 10))
				{
					return end();
				}
			},
			end: end,
		}
	},
}
