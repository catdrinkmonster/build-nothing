export type ObsidianGraphNode = {
  left: string;
  top: string;
  size: number;
  accent: boolean;
};

export type ObsidianGraphEdge = readonly [string, string, string, string];

const CLUSTERS = [
  { x: 12, y: 18 },
  { x: 26, y: 56 },
  { x: 46, y: 28 },
  { x: 64, y: 68 },
  { x: 82, y: 24 },
  { x: 88, y: 58 },
] as const;

const NODE_COUNT = 160;
const EDGE_COUNT = 420;

export const OBSIDIAN_GRAPH_NODES: ObsidianGraphNode[] = createNodes();
export const OBSIDIAN_GRAPH_EDGES: ObsidianGraphEdge[] = createEdges(
  OBSIDIAN_GRAPH_NODES,
);
export const OBSIDIAN_GRAPH_OFFSET = getObsidianGraphOffset(OBSIDIAN_GRAPH_NODES);

function createNodes() {
  const random = createRandom(0x0b51d14);
  const nodes: ObsidianGraphNode[] = [];

  for (let index = 0; index < NODE_COUNT; index += 1) {
    const cluster = CLUSTERS[index % CLUSTERS.length];
    const jitterX = (random() - 0.5) * 34;
    const jitterY = (random() - 0.5) * 30;
    const left = clamp(cluster.x + jitterX, 2, 98);
    const top = clamp(cluster.y + jitterY, 4, 96);

    nodes.push({
      left: `${left.toFixed(2)}%`,
      top: `${top.toFixed(2)}%`,
      size: 1 + Math.floor(random() * 3),
      accent: index % 11 === 0,
    });
  }

  return nodes;
}

function createEdges(nodes: ObsidianGraphNode[]) {
  const random = createRandom(0x00c0ffee);
  const edges: ObsidianGraphEdge[] = [];

  for (let index = 0; index < EDGE_COUNT; index += 1) {
    const from = nodes[Math.floor(random() * nodes.length)];
    const to =
      nodes[Math.floor(random() * nodes.length)] ?? nodes[0];

    edges.push([from.left, from.top, to.left, to.top]);
  }

  return edges;
}

function createRandom(seed: number) {
  let state = seed >>> 0;

  return function next() {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function getObsidianGraphOffset(nodes: ObsidianGraphNode[]) {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const node of nodes) {
    const x = parsePercent(node.left);
    const y = parsePercent(node.top);
    minX = Math.min(minX, x - node.size);
    maxX = Math.max(maxX, x + node.size);
    minY = Math.min(minY, y - node.size);
    maxY = Math.max(maxY, y + node.size);
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    x: 50 - centerX,
    y: 50 - centerY,
  };
}

function parsePercent(value: string) {
  return Number.parseFloat(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
