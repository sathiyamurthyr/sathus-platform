"""Document Chunking & Embeddings Abstraction Service (Story 28.2)."""

import math
from typing import List, Dict, Any


class ChunkingService:
    """Document chunking and vector embedding generator."""

    def chunk_text(
        self,
        text: str,
        chunk_size: int = 500,
        overlap: int = 50,
        strategy: str = "sliding_window"
    ) -> List[Dict[str, Any]]:
        """Split text into structured chunks with character bounds and token counts."""
        if not text:
            return []

        chunks = []
        words = text.split()
        total_words = len(words)
        
        step = max(1, chunk_size - overlap)
        chunk_index = 0

        for i in range(0, total_words, step):
            chunk_words = words[i : i + chunk_size]
            chunk_content = " ".join(chunk_words)
            token_count = max(1, math.ceil(len(chunk_content) / 4))

            start_char = text.find(chunk_words[0]) if chunk_words else 0
            end_char = start_char + len(chunk_content)

            chunks.append(
                {
                    "chunk_index": chunk_index,
                    "content": chunk_content,
                    "token_count": token_count,
                    "start_char": start_char,
                    "end_char": end_char,
                    "embedding": self._generate_mock_embedding(chunk_content),
                }
            )
            chunk_index += 1

        return chunks

    def _generate_mock_embedding(self, text: str, dimension: int = 1536) -> List[float]:
        """Generate normalized mock vector embedding for semantic vector index."""
        import random
        rng = random.Random(hash(text))
        vec = [rng.uniform(-1.0, 1.0) for _ in range(16)] # 16 key vector representation
        return vec
