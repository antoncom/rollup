const assert = require('assert');
const sideEffects = [];

module.exports = {
	description: 'handles setting moduleSideEffects in the load hook',
	context: {
		sideEffects
	},
	exports() {
		assert.deepStrictEqual(sideEffects, [
			'sideeffects-null-load-null',
			'sideeffects-true-load-null',
			'sideeffects-false-load-true',
			'sideeffects-null-load-true',
			'sideeffects-true-load-true'
		]);
	},
	options: {
		treeshake: {
			moduleSideEffects(id) {
				return JSON.parse(id.split('-')[1]);
			}
		},
		plugins: {
			name: 'test-plugin',
			resolveId(id) {
				if (id[0] !== '/') {
					return id;
				}
			},
			load(id) {
				if (id[0] !== '/') {
					const moduleSideEffects = JSON.parse(id.split('-')[3]);
					return {
						code: `export const value = '${id}'; sideEffects.push(value);`,
						moduleSideEffects
					};
				}
			}
		}
	}
};
