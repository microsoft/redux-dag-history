import { expect } from "chai";
import * as DagHistory from "../DagHistory";
import DagGraph from "../DagGraph";
const treeify = require("treeify");

describe("The DagHistory Module", () => {
    describe("createHistory", () => {
        it("can create a new history object", () => {
            const history = DagHistory.createHistory();
            expect(history).to.be.ok;
            expect(history.current).to.deep.equal({});

            const graph = new DagGraph(history.graph);
            expect(graph.currentStateId).to.be.ok;
            expect(graph.currentBranch).to.equal("master");
            expect(graph.latestOn("master")).to.equal(graph.currentStateId);
            expect(graph.committedOn("master")).to.equal(graph.currentStateId);
        });

        it("can create a new history object with an initial state", () => {
            const history = DagHistory.createHistory({current: {x: 1, y: 2}});
            expect(history).to.be.ok;
            expect(history.current).to.deep.equal({x: 1, y: 2});
            expect(history.graph).to.be.ok;
        });
    });

    describe("insert", () => {
        it("will insert a new state into the history", () => {
            const historyA = DagHistory.createHistory();
            const historyB = DagHistory.insert({x: 1}, historyA);

            const graphA = new DagGraph(historyA.graph);
            const graphB = new DagGraph(historyB.graph);
            expect(graphA.currentStateId).to.not.equal(graphB.currentStateId);
            expect(graphB.childrenOf(graphA.currentStateId)).to.deep.equal([graphB.currentStateId]);
            expect(graphB.latestOn("master")).to.equal(graphB.currentStateId);
            expect(graphB.committedOn("master")).to.equal(graphB.currentStateId);
        });

        it("will not cull children of the parent state that are associated with branches", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.jumpToState(graphA.currentStateId, historyB);
            const graphC = new DagGraph(historyC.graph);

            const historyD = DagHistory.insert({x: 2}, historyC);
            const graphD = new DagGraph(historyD.graph);
            expect(graphD.getState(graphB.currentStateId)).to.be.ok;
        });

        it("will cull children of the parent state that are not associated with branches", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.undo(historyB);
            const graphC = new DagGraph(historyC.graph);
            expect(graphC.latestOn("master")).to.equal(graphB.currentStateId);
            expect(graphC.committedOn("master")).to.equal(graphA.currentStateId);

            const historyD = DagHistory.insert({x: 2}, historyC);
            const graphD = new DagGraph(historyD.graph);
            expect(graphD.getState(graphB.currentStateId)).to.be.ok;
            expect(graphD.latestOn("master")).to.equal(graphD.currentStateId);
            expect(graphD.committedOn("master")).to.equal(graphD.currentStateId);
        });
    });

    describe("undo/redo", () => {
        it("undo will move the committed state back, leaving latest in place", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.undo(historyB);
            const graphC = new DagGraph(historyC.graph);
            expect(graphC.latestOn("master")).to.equal(graphB.currentStateId);
            expect(graphC.committedOn("master")).to.equal(graphA.currentStateId);
        });

        it("redo will move the committed state forward", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.undo(historyB);
            const historyD = DagHistory.redo(historyC);

            const graphD = new DagGraph(historyD.graph);
            expect(graphD.latestOn("master")).to.equal(graphB.currentStateId);
            expect(graphD.committedOn("master")).to.equal(graphB.currentStateId);
        });
    });

    describe("create branch", () => {
        it("will create a new branch on the current active with a common ancestor", () => {
            // a -> b <master>
            //   -> e <derp>
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.jumpToState(graphA.currentStateId, historyB);
            const graphC = new DagGraph(historyC.graph);

            const historyD = DagHistory.createBranch("derp", historyC);
            const graphD = new DagGraph(historyD.graph);

            const historyE = DagHistory.insert({x: 2}, historyD);
            const graphE = new DagGraph(historyE.graph);

            expect(graphD.currentBranch).to.equal("derp");
            expect(graphD.latestOn("derp")).to.equal(graphD.currentStateId);
            expect(graphD.committedOn("derp")).to.equal(graphD.currentStateId);

            expect(graphE.commitPath(graphE.currentStateId)).to.deep.equal([graphA.currentStateId, graphE.currentStateId]);
            expect(graphE.commitPath(graphB.currentStateId)).to.deep.equal([graphA.currentStateId, graphB.currentStateId]);

        });

        it("will create a new branch on the current active node", () => {
            // a -> b <master>
            //        -> e <derp>
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyD = DagHistory.createBranch("derp", historyB);
            const graphD = new DagGraph(historyD.graph);

            const historyE = DagHistory.insert({x: 2}, historyD);
            const graphE = new DagGraph(historyE.graph);

            expect(graphD.currentBranch).to.equal("derp");
            expect(graphD.latestOn("derp")).to.equal(graphD.currentStateId);
            expect(graphD.committedOn("derp")).to.equal(graphD.currentStateId);

            expect(graphE.commitPath(graphE.currentStateId)).to.deep.equal([graphA.currentStateId, graphB.currentStateId, graphE.currentStateId]);
            expect(graphE.commitPath(graphB.currentStateId)).to.deep.equal([graphA.currentStateId, graphB.currentStateId]);

            console.log("Graph: \n", graphE.print());
        });
    });

    describe("clear", () => {
        it("can clear the history", () => {
            const historyA = DagHistory.createHistory();
            const historyB = DagHistory.insert({x: 1}, historyA);

            const historyC = DagHistory.clear(historyB);
            expect(Object.keys(historyC.graph.get("states").toJS()).length).to.equal(1);
        });
    });

    describe("squash", () => {
        it("will collapse parent states that have a single ancestor", () => {
            const historyInit = DagHistory.createHistory({x: 0});
            const branchA = DagHistory.createBranch("A", historyInit);
            const branchACommit1 = DagHistory.insert({x: 1}, branchA);
            const jumpBack = DagHistory.jumpToBranch("master", branchACommit1);
            const branchB = DagHistory.createBranch("B", jumpBack);
            const branchBCommit1 = DagHistory.insert({x: 2}, branchB);
            const branchBCommit2 = DagHistory.insert({x: 3}, branchBCommit1);

            // Commit 1 and Commit 2 from Branch B should be squashed
            const squashed = DagHistory.squash(branchBCommit2);
            expect(Object.keys(squashed.graph.get("states").toJS()).length).to.equal(3);
        });

        it("will collapse a linear chain into a single root", () => {
            const init = DagHistory.createHistory({x: 0});
            const histA = DagHistory.insert({x: 1}, init);
            const histB = DagHistory.insert({x: 2}, histA);
            const histC = DagHistory.insert({x: 3}, histB);

            // Commit 1 and Commit 2 from Branch B should be squashed
            const squashed = DagHistory.squash(histC);
            expect(Object.keys(squashed.graph.get("states").toJS()).length).to.equal(1);
        });
    });
});
