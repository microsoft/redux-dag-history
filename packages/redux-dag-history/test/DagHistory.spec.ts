import DagGraph from '../src/DagGraph'
import * as DagHistory from '../src/DagHistory'

const stateNameById = {
	actionName: (state: any, id: number) => `${id}`,
	branchName: (oldBranch: any, newBranch: any, actionName: string) =>
		actionName,
}
const INITIAL_BRANCH = '1'

interface BasicState {
	x: number
	y?: number
}

describe('The DagHistory Module', () => {
	describe('createHistory', () => {
		it('can create a new history object', () => {
			const history = DagHistory.createHistory()
			expect(history).toBeDefined()
			expect(history.current).toMatchObject({})

			const graph = new DagGraph(history.graph)
			expect(graph.currentStateId).toBeDefined()

			// 'expected current branch to be initial',
			expect(graph.currentBranch).toEqual(INITIAL_BRANCH)
			// 'expected latest on branch to equal current state',
			expect(graph.latestOn(INITIAL_BRANCH)).toEqual(graph.currentStateId)
			// 'expected committed on branch to equal current state',
			expect(graph.committedOn(INITIAL_BRANCH)).toEqual(graph.currentStateId)
		})

		it('can create a new history object with an initial state', () => {
			const history = DagHistory.createHistory<BasicState>({ x: 1, y: 2 })
			expect(history).toBeDefined()
			expect(history.current).toMatchObject({ x: 1, y: 2 })
			expect(history.graph).toBeDefined()
		})
	})

	describe('insert', () => {
		it('will insert a new state into the history', () => {
			const historyA = DagHistory.createHistory<BasicState>()
			const historyB = DagHistory.insert({ x: 1 }, historyA, stateNameById)

			const graphA = new DagGraph(historyA.graph)
			const graphB = new DagGraph(historyB.graph)
			expect(graphA.currentStateId).not.toEqual(graphB.currentStateId)
			expect(graphB.childrenOf(graphA.currentStateId)).toMatchObject([
				graphB.currentStateId,
			])
			expect(graphB.latestOn(INITIAL_BRANCH)).toEqual(graphB.currentStateId)
			expect(graphB.committedOn(INITIAL_BRANCH)).toEqual(graphB.currentStateId)
		})

		it('will not cull children of the parent state that are associated with branches', () => {
			const historyA = DagHistory.createHistory<BasicState>()
			const graphA = new DagGraph(historyA.graph)

			const historyB = DagHistory.insert({ x: 1 }, historyA, stateNameById)
			const graphB = new DagGraph(historyB.graph)

			const historyC = DagHistory.jumpToState(graphA.currentStateId, historyB)

			const historyD = DagHistory.insert({ x: 2 }, historyC, stateNameById)
			const graphD = new DagGraph(historyD.graph)
			expect(graphD.getState(graphB.currentStateId)).toBeDefined()
		})

		it('will cull children of the parent state that are not associated with branches', () => {
			let history = DagHistory.createHistory<BasicState>()
			let graph = new DagGraph(history.graph)
			let currentBranch = graph.currentBranch

			const insert = () => {
				history = DagHistory.insert({ x: 1 }, history, stateNameById)
				graph = new DagGraph(history.graph)
				currentBranch = graph.currentBranch
				return graph.currentStateId
			}

			// Set up an initial state
			//  (init) A*
			const stateA = graph.currentStateId

			// Insert a new state into the graph:
			//   (init) A -> B*
			const stateB = insert()

			// Undo State B
			//   (init) A* -> B
			history = DagHistory.undo(history)
			graph = new DagGraph(history.graph)
			// 'C -> latest should be state B',
			expect(graph.latestOn(INITIAL_BRANCH)).toEqual(stateB)
			// 'D -> committed should be state A',
			expect(graph.committedOn(INITIAL_BRANCH)).toEqual(stateA)

			// Insert a new state
			//   (init)    A -> B
			//   (init-1)    -> C*
			const stateC = insert()
			// 'implicit branch should be created (1)',
			expect(currentBranch).not.toEqual(INITIAL_BRANCH)

			/// graphD Contains all the states
			expect(graph.getState(stateA)).toBeDefined()
			expect(graph.getState(stateB)).toBeDefined()
			expect(graph.getState(stateC)).toBeDefined()

			// Init Branch contains A and B
			// 'D -> latest on init is B',
			expect(graph.latestOn(INITIAL_BRANCH)).toEqual(stateB)
			// 'D -> committed on init is A',
			expect(graph.committedOn(INITIAL_BRANCH)).toEqual(stateA)

			// Current Branch contains C
			// 'D -> latest on current is C',
			expect(graph.latestOn(currentBranch)).toEqual(stateC)
			// 'D -> committed on current is C',
			expect(graph.committedOn(currentBranch)).toEqual(stateC)
			// 'D ->*p first on current is C',
			expect(graph.firstOn(currentBranch)).toEqual(stateC)
			expect(graph.commitPath(stateC)).toMatchObject([1, 3])

			// Check branch depths
			// 'start depth should be 1',
			expect(graph.branchStartDepth(currentBranch)).toEqual(1)
			// 'end depth should be 1',
			expect(graph.branchEndDepth(currentBranch)).toEqual(1)
			// 'max depth should be 1'
			expect(graph.maxDepth).toEqual(1)

			// Insert a new state
			//   (init)    A -> B
			//   (init-1)    -> C -> D
			insert()
			// 'implicit branch should be created (2)',
			expect(currentBranch).not.toEqual(INITIAL_BRANCH)
			// 'start depth should be 1',
			expect(graph.branchStartDepth(currentBranch)).toEqual(1)
			// 'end depth should be 2',
			expect(graph.branchEndDepth(currentBranch)).toEqual(2)
			// 'max depth should be 2'
			expect(graph.maxDepth).toEqual(2)
		})
	})

	describe('undo/redo', () => {
		it('undo will move the committed state back, leaving latest in place', () => {
			const historyA = DagHistory.createHistory<BasicState>()
			const graphA = new DagGraph(historyA.graph)

			const historyB = DagHistory.insert({ x: 1 }, historyA, stateNameById)
			const graphB = new DagGraph(historyB.graph)

			const historyC = DagHistory.undo(historyB)
			const graphC = new DagGraph(historyC.graph)
			expect(graphC.latestOn(INITIAL_BRANCH)).toEqual(graphB.currentStateId)
			expect(graphC.committedOn(INITIAL_BRANCH)).toEqual(graphA.currentStateId)
		})

		it('redo will move the committed state forward', () => {
			const historyA = DagHistory.createHistory<BasicState>()

			const historyB = DagHistory.insert({ x: 1 }, historyA, stateNameById)
			const graphB = new DagGraph(historyB.graph)

			const historyC = DagHistory.undo(historyB)
			const historyD = DagHistory.redo(historyC)

			const graphD = new DagGraph(historyD.graph)
			expect(graphD.latestOn(INITIAL_BRANCH)).toEqual(graphB.currentStateId)
			expect(graphD.committedOn(INITIAL_BRANCH)).toEqual(graphB.currentStateId)
		})
	})

	describe('create branch', () => {
		it('will create a new branch on the current active with a common ancestor', () => {
			const historyA = DagHistory.createHistory<BasicState>()
			const graphA = new DagGraph(historyA.graph)

			const historyB = DagHistory.insert({ x: 1 }, historyA, stateNameById)
			const graphB = new DagGraph(historyB.graph)

			const historyC = DagHistory.jumpToState(graphA.currentStateId, historyB)

			const historyD = DagHistory.createBranch('derp', historyC)
			const graphD = new DagGraph(historyD.graph)

			const historyE = DagHistory.insert({ x: 2 }, historyD, stateNameById)
			const graphE = new DagGraph(historyE.graph)

			// a -> b <master>
			//   -> e <derp>
			const currentBranch = graphD.currentBranch
			expect(graphD.getBranchName(currentBranch)).toEqual('derp')
			expect(graphD.latestOn(currentBranch)).toEqual(graphD.currentStateId)
			expect(graphD.committedOn(currentBranch)).toEqual(graphD.currentStateId)

			expect(graphE.commitPath(graphE.currentStateId)).toMatchObject([
				graphA.currentStateId,
				graphE.currentStateId,
			])
			expect(graphE.commitPath(graphB.currentStateId)).toMatchObject([
				graphA.currentStateId,
				graphB.currentStateId,
			])
		})

		it('will create a new branch on the current active node', () => {
			const historyA = DagHistory.createHistory<BasicState>()
			const graphA = new DagGraph(historyA.graph)

			const historyB = DagHistory.insert({ x: 1 }, historyA, stateNameById)
			const graphB = new DagGraph(historyB.graph)

			const historyD = DagHistory.createBranch('derp', historyB)
			const graphD = new DagGraph(historyD.graph)

			const historyE = DagHistory.insert({ x: 2 }, historyD, stateNameById)
			const graphE = new DagGraph(historyE.graph)

			// a -> b <master>
			//        -> e <derp>
			const currentBranch = graphD.currentBranch
			expect(graphD.getBranchName(currentBranch)).toEqual('derp')
			expect(graphD.latestOn(currentBranch)).toEqual(graphD.currentStateId)
			expect(graphD.committedOn(currentBranch)).toEqual(graphD.currentStateId)

			expect(graphE.commitPath(graphE.currentStateId)).toMatchObject([
				graphA.currentStateId,
				graphB.currentStateId,
				graphE.currentStateId,
			])
			expect(graphE.commitPath(graphB.currentStateId)).toMatchObject([
				graphA.currentStateId,
				graphB.currentStateId,
			])
		})
	})

	describe('clear', () => {
		it('can clear the history', () => {
			const historyA = DagHistory.createHistory<BasicState>()
			const historyB = DagHistory.insert({ x: 1 }, historyA, stateNameById)

			const historyC = DagHistory.clear(historyB)
			expect(Object.keys(historyC.graph.get('states').toJS()).length).toEqual(1)
		})
	})

	describe('squash', () => {
		it('will collapse parent states that have a single ancestor', () => {
			let history = DagHistory.createHistory<BasicState>({ x: 0 })

			// Create a Branch and a Commired
			//  (init)  I
			//  (A)       -> A0*
			history = DagHistory.createBranch('A', history)
			history = DagHistory.insert({ x: 1 }, history, stateNameById)

			// Pop back to the Initial Branch
			// (init) I*
			// (A)       -> A0
			history = DagHistory.jumpToBranch(INITIAL_BRANCH, history)

			// Create a new branch with Two Additional Commits
			// (init) I
			// (A)      -> A0
			// (B)      -> B0 -> B1 -> B2*
			history = DagHistory.createBranch('B', history)
			history = DagHistory.insert({ x: 2 }, history, stateNameById)
			history = DagHistory.insert({ x: 3 }, history, stateNameById)

			// Squash Branch B
			// (init) I
			// (A)       -> A0
			// (B)       -> B0* (squashed)
			//
			// NOTE: Commit 1 and Commit 2 from Branch B should be squashed
			history = DagHistory.squash(history)
			// 'There should be 4 states after the squash',
			expect(Object.keys(history.graph.get('states').toJS()).length).toEqual(3)
		})

		it('will collapse a linear chain into a single root', () => {
			let history = DagHistory.createHistory<BasicState>({ x: 0 })
			history = DagHistory.insert({ x: 1 }, history, stateNameById)
			history = DagHistory.insert({ x: 2 }, history, stateNameById)
			history = DagHistory.insert({ x: 3 }, history, stateNameById)
			// Set up a flat linear chain
			// (init)  I -> A -> B -> C*
			// A squash should flatten this totally
			// (init) I* (squashed)
			history = DagHistory.squash(history)
			expect(Object.keys(history.graph.get('states').toJS()).length).toEqual(1)
		})
	})
})
