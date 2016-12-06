import DagGraph from "../src/DagGraph";
import { expect } from "chai";
import { fromJS } from "immutable";

function makeGraph() {
  return new DagGraph(fromJS({
    current: {
      state: 1,
      branch: 1,
    },
    branches: {
      [1]: {
        latest: 1,
        name: "Initial Branch",
        first: 1,
        committed: 1,
      },
    },
    states: {
      [1]: {
        state: { a: 1, b: "xyz" },
        name: "Initial State",
        branch: 1,
        parent: null,
      },
    },
  }));
}

describe("DagGraph", () => {
  it("exists", () => {
    expect(DagGraph).to.be.ok;
  });

  describe("construction", () => {
    it("will throw an error if constructed without a valid graph", () => {
      expect(() => new DagGraph(null)).to.throw(/must be defined/);
    });

    it("will throw in constructed with a plain object", () => {
      expect(() => new DagGraph({} as any)).to.throw(/must be an immutablejs instance/);
    });
  });

  describe("print", () => {
    it("will print out a basic graph", () => {
      const graph = makeGraph();
      expect(graph.print()).to.equal(`├─ current
│  ├─ state: 1
│  └─ branch: 1
├─ branches
│  └─ 1
│     ├─ latest: 1
│     ├─ name: Initial Branch
│     ├─ first: 1
│     └─ committed: 1
└─ dag
   ├─ id: 1
   ├─ name: Initial State
   └─ children
`);
    });
  });

  describe("depthIndexOf", () => {
    it("can determine depthIndex=0 for a root commit", () => {
      const graph = makeGraph();
      expect(graph.depthIndexOf(1, 1)).to.equal(0);
    });
  });
});
