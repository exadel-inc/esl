import {generateUId} from '../uid';

const TRY_COUNT = 5;

describe('misc/uid helper tests', () => {
	test('uid', () => {
		const set = new Set();
		for (let i = 0; i < TRY_COUNT; ++i) {
			set.add(generateUId());
		}
		expect(set.size).toBe(TRY_COUNT);
	});
});
