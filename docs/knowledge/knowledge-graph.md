# Enterprise Knowledge Graph Guide

**Document:** `docs/knowledge/knowledge-graph.md`  
**EPIC:** EPIC-028 (Story 28.4)  
**Status:** Production Ready  

---

## Overview

The **Enterprise Knowledge Graph Engine** provides entity resolution, typed relationship discovery, business glossary ontologies, taxonomy structures, and graph traversals.

---

## Graph Schema

- **Nodes (`KnowledgeEntity`, `GraphNode`)**: Represent concepts, products, teams, systems, or documents.
- **Edges (`KnowledgeRelationship`, `GraphEdge`)**: Directed relationships (`OWNS`, `DEPENDS_ON`, `CONTAINS`, `USES`, `RELATED_TO`) weighted by confidence scores.
- **Ontology (`OntologyModel`)**: Schema definitions enforcing class hierarchies and domain constraints.
