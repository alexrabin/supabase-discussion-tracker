interface Discussion {
  title: string;
  createdAt: Date;
  comments: Edge;
}

interface Edge {
  edges: Node[];
}

interface Node {
  node: NodeData;
}

interface Author {
  login: string;
  url: string;
}

export interface NodeData {
  body: string;
  author: Author;
}
export default Discussion;
