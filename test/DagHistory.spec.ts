/// <reference path="../node_modules/typescript/lib/lib.es7.d.ts" />
import { expect } from "chai";
import * as DagHistory from "../src/DagHistory";
import DagGraph from "../src/DagGraph";
const treeify = require("treeify");

const stateNameById = {
    actionName: (state: any, id: number) => `${id}`,
    branchName: (oldBranch: any, newBranch: any, actionName: string) => actionName,
};
const INITIAL_BRANCH = 1;

describe("The DagHistory Module", () => {
    describe("createHistory", () => {
        it("can create a new history object", () => {
            const history = DagHistory.createHistory();
            expect(history).to.be.ok;
            expect(history.current).to.deep.equal({});

            const graph = new DagGraph(history.graph);
            expect(graph.currentStateId).to.be.ok;
            expect(graph.currentBranch).to.equal(INITIAL_BRANCH, "expected current branch to be initial");
            expect(graph.latestOn(INITIAL_BRANCH)).to.equal(graph.currentStateId, "expected latest on branch to equal current state");
            expect(graph.committedOn(INITIAL_BRANCH)).to.equal(graph.currentStateId, "expected committed on branch to equal current state");
        });

        it("can create a new history object with an initial state", () => {
            const history = DagHistory.createHistory({x: 1, y: 2});
            expect(history).to.be.ok;
            expect(history.current).to.deep.equal({x: 1, y: 2});
            expect(history.graph).to.be.ok;
        });
    });

    describe("insert", () => {
        it("will insert a new state into the history", () => {
            const historyA = DagHistory.createHistory();
            const historyB = DagHistory.insert({x: 1}, historyA, stateNameById);

            const graphA = new DagGraph(historyA.graph);
            const graphB = new DagGraph(historyB.graph);
            expect(graphA.currentStateId).to.not.equal(graphB.currentStateId);
            expect(graphB.childrenOf(graphA.currentStateId)).to.deep.equal([graphB.currentStateId]);
            expect(graphB.latestOn(INITIAL_BRANCH)).to.equal(graphB.currentStateId);
            expect(graphB.committedOn(INITIAL_BRANCH)).to.equal(graphB.currentStateId);
        });

        it("will not cull children of the parent state that are associated with branches", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA, stateNameById);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.jumpToState(graphA.currentStateId, historyB);
            const graphC = new DagGraph(historyC.graph);

            const historyD = DagHistory.insert({x: 2}, historyC, stateNameById);
            const graphD = new DagGraph(historyD.graph);
            expect(graphD.getState(graphB.currentStateId)).to.be.ok;
        });

        it("will cull children of the parent state that are not associated with branches", () => {
            let history = DagHistory.createHistory();
            let graph = new DagGraph(history.graph);
            let currentBranch = graph.currentBranch;

            let insert = () => {
                history = DagHistory.insert({x: 1}, history, stateNameById);
                graph = new DagGraph(history.graph);
                currentBranch = graph.currentBranch;
                return graph.currentStateId;
            };

            // Set up an initial state
            //  (init) A*
            const stateA = graph.currentStateId;

            // Insert a new state into the graph:
            //   (init) A -> B*
            const stateB = insert();

            // Undo State B
            //   (init) A* -> B
            history = DagHistory.undo(history);
            graph = new DagGraph(history.graph);
            expect(graph.latestOn(INITIAL_BRANCH)).to.equal(stateB, "C -> latest should be state B");
            expect(graph.committedOn(INITIAL_BRANCH)).to.equal(stateA, "D -> committed should be state A");

            // Insert a new state
            //   (init)    A -> B
            //   (init-1)    -> C*
            const stateC = insert();
            expect(currentBranch).to.not.equal(INITIAL_BRANCH, "implicit branch should be created (1)");

            /// graphD Contains all the states
            expect(graph.getState(stateA)).to.be.ok;
            expect(graph.getState(stateB)).to.be.ok;
            expect(graph.getState(stateC)).to.be.ok;

            // Init Branch contains A and B
            expect(graph.latestOn(INITIAL_BRANCH)).to.equal(stateB, "D -> latest on init is B");
            expect(graph.committedOn(INITIAL_BRANCH)).to.equal(stateA, "D -> committed on init is A");

            // Current Branch contains C
            expect(graph.latestOn(currentBranch)).to.equal(stateC, "D -> latest on current is C");
            expect(graph.committedOn(currentBranch)).to.equal(stateC, "D -> committed on current is C");
            expect(graph.firstOn(currentBranch)).to.equal(stateC, "D ->*p first on current is C");
            expect(graph.commitPath(stateC)).to.deep.equal([1, 3]);

            // Check branch depths
            expect(graph.branchStartDepth(currentBranch)).to.equal(1, "start depth should be 1");
            expect(graph.branchEndDepth(currentBranch)).to.equal(1, "end depth should be 1");
            expect(graph.maxDepth).to.equal(1, "max depth should be 1");

            // Insert a new state
            //   (init)    A -> B
            //   (init-1)    -> C -> D
            const stateD = insert();
            expect(currentBranch).to.not.equal(INITIAL_BRANCH, "implicit branch should be created (2)");
            expect(graph.branchStartDepth(currentBranch)).to.equal(1, "start depth should be 1");
            expect(graph.branchEndDepth(currentBranch)).to.equal(2, "end depth should be 2");
            expect(graph.maxDepth).to.equal(2, "max depth should be 2");
        });
    });

    describe("undo/redo", () => {
        it("undo will move the committed state back, leaving latest in place", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA, stateNameById);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.undo(historyB);
            const graphC = new DagGraph(historyC.graph);
            expect(graphC.latestOn(INITIAL_BRANCH)).to.equal(graphB.currentStateId);
            expect(graphC.committedOn(INITIAL_BRANCH)).to.equal(graphA.currentStateId);
        });

        it("redo will move the committed state forward", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA, stateNameById);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.undo(historyB);
            const historyD = DagHistory.redo(historyC);

            const graphD = new DagGraph(historyD.graph);
            expect(graphD.latestOn(INITIAL_BRANCH)).to.equal(graphB.currentStateId);
            expect(graphD.committedOn(INITIAL_BRANCH)).to.equal(graphB.currentStateId);
        });
    });

    describe("create branch", () => {
        it("will create a new branch on the current active with a common ancestor", () => {
            // a -> b <master>
            //   -> e <derp>
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA, stateNameById);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.jumpToState(graphA.currentStateId, historyB);
            const graphC = new DagGraph(historyC.graph);

            const historyD = DagHistory.createBranch("derp", historyC);
            const graphD = new DagGraph(historyD.graph);

            const historyE = DagHistory.insert({x: 2}, historyD, stateNameById);
            const graphE = new DagGraph(historyE.graph);

            let currentBranch = graphD.currentBranch;
            expect(graphD.getBranchName(currentBranch)).to.equal("derp");
            expect(graphD.latestOn(currentBranch)).to.equal(graphD.currentStateId);
            expect(graphD.committedOn(currentBranch)).to.equal(graphD.currentStateId);

            expect(graphE.commitPath(graphE.currentStateId)).to.deep.equal([graphA.currentStateId, graphE.currentStateId]);
            expect(graphE.commitPath(graphB.currentStateId)).to.deep.equal([graphA.currentStateId, graphB.currentStateId]);
        });

        it("will create a new branch on the current active node", () => {
            // a -> b <master>
            //        -> e <derp>
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA, stateNameById);
            const graphB = new DagGraph(historyB.graph);

            const historyD = DagHistory.createBranch("derp", historyB);
            const graphD = new DagGraph(historyD.graph);

            const historyE = DagHistory.insert({x: 2}, historyD, stateNameById);
            const graphE = new DagGraph(historyE.graph);

            const currentBranch = graphD.currentBranch;
            expect(graphD.getBranchName(currentBranch)).to.equal("derp");
            expect(graphD.latestOn(currentBranch)).to.equal(graphD.currentStateId);
            expect(graphD.committedOn(currentBranch)).to.equal(graphD.currentStateId);

            expect(graphE.commitPath(graphE.currentStateId)).to.deep.equal([graphA.currentStateId, graphB.currentStateId, graphE.currentStateId]);
            expect(graphE.commitPath(graphB.currentStateId)).to.deep.equal([graphA.currentStateId, graphB.currentStateId]);
        });
    });

    describe("clear", () => {
        it("can clear the history", () => {
            const historyA = DagHistory.createHistory();
            const historyB = DagHistory.insert({x: 1}, historyA, stateNameById);

            const historyC = DagHistory.clear(historyB);
            expect(Object.keys(historyC.graph.get("states").toJS()).length).to.equal(1);
        });
    });

    describe("squash", () => {
        it("will collapse parent states that have a single ancestor", () => {
            let history = DagHistory.createHistory({x: 0});

            // Create a Branch and a Commired
            //  (init)  I
            //  (A)       -> A0*
            history = DagHistory.createBranch("A", history);
            history = DagHistory.insert({x: 1}, history, stateNameById);

            // Pop back to the Initial Branch
            // (init) I*
            // (A)       -> A0
            history = DagHistory.jumpToBranch(INITIAL_BRANCH, history);

            // Create a new branch with Two Additional Commits
            // (init) I
            // (A)      -> A0
            // (B)      -> B0 -> B1 -> B2*
            history = DagHistory.createBranch("B", history);
            history = DagHistory.insert({x: 2}, history, stateNameById);
            history = DagHistory.insert({x: 3}, history, stateNameById);

            // Squash Branch B
            // (init) I
            // (A)       -> A0
            // (B)       -> B0* (squashed)
            //
            // NOTE: Commit 1 and Commit 2 from Branch B should be squashed
            history = DagHistory.squash(history);
            expect(Object.keys(history.graph.get("states").toJS()).length).to.equal(3, "There should be 4 states after the squash");
        });

        it("will collapse a linear chain into a single root", () => {
            // Set up a flat linear chain
            // (init)  I -> A -> B -> C*
            let history = DagHistory.createHistory({x: 0});
            history = DagHistory.insert({x: 1}, history, stateNameById);
            history = DagHistory.insert({x: 2}, history, stateNameById);
            history = DagHistory.insert({x: 3}, history, stateNameById);

            // A squash should flatten this totally
            // (init) I* (squashed)
            history = DagHistory.squash(history);
            expect(Object.keys(history.graph.get("states").toJS()).length).to.equal(1);
        });
    });
});
