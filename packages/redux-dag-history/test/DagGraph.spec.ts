import { fromJS } from 'immutable'
import DagGraph from '../src/DagGraph'

function makeGraph() {
	return new DagGraph(
		fromJS({
			current: {
				state: '1',
				branch: '1',
			},
			branches: {
				1: {
					latest: '1',
					name: 'Initial Branch',
					first: '1',
					committed: '1',
				},
			},
			states: {
				1: {
					state: { a: 1, b: 'xyz' },
					name: 'Initial State',
					branch: '1',
					parent: null,
				},
			},
		}),
	)
}

describe('DagGraph', () => {
	it('exists', () => {
		expect(DagGraph).toBeDefined()
	})

	describe('construction', () => {
		it('will throw an error if constructed without a valid graph', () => {
			expect(() => new DagGraph(null)).toThrow(/must be defined/)
		})

		it('will throw in constructed with a plain object', () => {
			expect(() => new DagGraph({} as any)).toThrow(
				/must be an immutablejs instance/,
			)
		})
	})

	describe('depthIndexOf', () => {
		it('can determine depthIndex=0 for a root commit', () => {
			const graph = makeGraph()
			expect(graph.depthIndexOf('1', '1')).toEqual(0)
		})
	})
})
