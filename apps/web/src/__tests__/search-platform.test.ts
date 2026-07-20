import { mockSearchDocuments, mockSavedSearches, mockSearchSuggestions } from '../features/search/data/mock-search-index';

describe('EPIC-019 Enterprise Search & Knowledge Platform Verification', () => {
  it('contains indexed search documents across multiple entity types', () => {
    expect(mockSearchDocuments.length).toBeGreaterThan(0);
    const entityTypes = mockSearchDocuments.map((d) => d.entityType);
    expect(entityTypes).toContain('projects');
    expect(entityTypes).toContain('ai_knowledge');
    expect(entityTypes).toContain('files');
    expect(entityTypes).toContain('tasks');
    expect(entityTypes).toContain('documentation');
  });

  it('validates vector similarity score and RAG snippet readiness for EPIC-020', () => {
    const aiDoc = mockSearchDocuments.find((d) => d.entityType === 'ai_knowledge');
    expect(aiDoc).toBeDefined();
    expect(aiDoc?.vectorSimilarityScore).toBeGreaterThan(0.8);
    expect(aiDoc?.ragSnippet).toBeTruthy();
    expect(aiDoc?.knowledgeGraphNodes?.length).toBeGreaterThan(0);
  });

  it('validates mock saved searches structure', () => {
    expect(mockSavedSearches.length).toBeGreaterThan(0);
    mockSavedSearches.forEach((s) => {
      expect(s.name).toBeTruthy();
      expect(s.query).toBeTruthy();
      expect(s.filters).toBeDefined();
    });
  });

  it('validates instant search suggestions', () => {
    expect(mockSearchSuggestions.length).toBeGreaterThan(0);
    mockSearchSuggestions.forEach((s) => {
      expect(s.text).toBeTruthy();
      expect(['query', 'entity']).toContain(s.type);
    });
  });
});
