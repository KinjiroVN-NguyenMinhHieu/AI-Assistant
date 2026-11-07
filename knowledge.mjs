/**
 * RAG adapter: replace getRelevantContext() with your SQL/vector database query.
 * Return a short, permission-filtered set of source snippets, e.g.
 * [{ source: 'attendance-rules', text: '...' }]. Empty results are expected
 * until a database is connected and never stop the chat from working.
 */
export async function getRelevantContext(_query) {
  // TODO: connect PostgreSQL/SQL Server/your vector store here.
  return [];
}

export function isKnowledgeBaseConnected() {
  // Update this when getRelevantContext() is connected to a real data source.
  return false;
}
