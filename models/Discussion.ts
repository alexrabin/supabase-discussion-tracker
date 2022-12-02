interface Discussion {
  title: string;
  createdAt: Date;
  comments: Edge;
}

interface Edge {
  edges: Node[];
}

interface Node {
  node: Comment;
}

interface Comment {
  body: string;
}
export default Discussion;
