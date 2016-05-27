import { expect } from "chai";
import * as DagHistory from "../src/DagHistory";
import { DagGraph } from "../src/DagGraph";

describe("The DagHistory Module", () => {
    describe("createHistory", () => {
        it("can create a new history object", () => {
            const history = DagHistory.createHistory();
            expect(history).to.be.ok;
            expect(history.current).to.deep.equal({});

            const graph = new DagGraph(history.graph);
            expect(graph.currentState).to.be.ok;
            expect(graph.currentBranch).to.equal("master");
            expect(graph.latestOn("master")).to.equal(graph.currentState);
            expect(graph.committedOn("master")).to.equal(graph.currentState);
        });

        it("can create a new history object with an initial state", () => {
            const history = DagHistory.createHistory({x: 1, y: 2});
            expect(history).to.be.ok;
            expect(history.current).to.deep.equal({x: 1, y: 2});
        });
    });

    describe("insert", () => {
        it("will insert a new state into the history", () => {
            const historyA = DagHistory.createHistory();
            const historyB = DagHistory.insert({x: 1}, historyA);

            const graphA = new DagGraph(historyA.graph);
            const graphB = new DagGraph(historyB.graph);
            expect(graphA.currentState).to.not.equal(graphB.currentState);
            expect(graphB.childrenOf(graphA.currentState).toJS()).to.deep.equal([graphB.currentState]);
            expect(graphB.latestOn("master")).to.equal(graphB.currentState);
            expect(graphB.committedOn("master")).to.equal(graphB.currentState);
        });

        it("will not cull children of the parent state that are associated with branches", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.jumpToState(graphA.currentState, historyB);
            const graphC = new DagGraph(historyC.graph);

            const historyD = DagHistory.insert({x: 2}, historyC);
            const graphD = new DagGraph(historyD.graph);
            expect(graphD.getState(graphB.currentState)).to.be.ok;
        });

        it("will cull children of the parent state that are not associated with branches", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.undo(historyB);
            const graphC = new DagGraph(historyC.graph);
            expect(graphC.latestOn("master")).to.equal(graphB.currentState);
            expect(graphC.committedOn("master")).to.equal(graphA.currentState);

            const historyD = DagHistory.insert({x: 2}, historyC);
            const graphD = new DagGraph(historyD.graph);
            expect(graphD.getState(graphB.currentState)).to.be.ok;
            expect(graphD.latestOn("master")).to.equal(graphD.currentState);
            expect(graphD.committedOn("master")).to.equal(graphD.currentState);
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
            expect(graphC.latestOn("master")).to.equal(graphB.currentState);
            expect(graphC.committedOn("master")).to.equal(graphA.currentState);
        });

        it("redo will move the committed state forward", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.undo(historyB)
            const historyD = DagHistory.redo(historyC);

            const graphD = new DagGraph(historyD.graph);
            expect(graphD.latestOn("master")).to.equal(graphB.currentState);
            expect(graphD.committedOn("master")).to.equal(graphB.currentState);
        });
    });

    describe("create branch", () => {
        it("will create a new branch on the current active node", () => {
            const historyA = DagHistory.createHistory();
            const graphA = new DagGraph(historyA.graph);

            const historyB = DagHistory.insert({x: 1}, historyA);
            const graphB = new DagGraph(historyB.graph);

            const historyC = DagHistory.jumpToState(graphA.currentState, historyB);
            const graphC = new DagGraph(historyC.graph);

            const historyD = DagHistory.createBranch("derp", historyC);
            const graphD = new DagGraph(historyD.graph);
            expect(graphD.currentBranch).to.equal("derp");
            expect(graphD.latestOn("derp")).to.equal(graphD.currentState);
            expect(graphD.committedOn("derp")).to.equal(graphD.currentState);
        });
    });
});

/*
exports.CLEAR = "DAG_HISTORY_CLEAR";
exports.SQUASH = "DAG_HISTORY_SQUASH";
*/
