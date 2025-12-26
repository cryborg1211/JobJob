import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from config import Config


class SkillMatcher:
    """Semantic skill matching using sentence transformers."""

    def __init__(self):
        self.model = None
        self._embeddings_cache = {}

    def _load_model(self):
        """Lazy load the embedding model."""
        if self.model is None:
            print(f"Loading embedding model: {Config.EMBEDDING_MODEL}")
            self.model = SentenceTransformer(Config.EMBEDDING_MODEL)
        return self.model

    def get_embedding(self, text: str) -> np.ndarray:
        """Get embedding for a text, with caching."""
        if text in self._embeddings_cache:
            return self._embeddings_cache[text]

        model = self._load_model()
        embedding = model.encode(text, convert_to_numpy=True)
        self._embeddings_cache[text] = embedding
        return embedding

    def get_skills_embedding(self, skills: list) -> np.ndarray:
        """Get combined embedding for a list of skills."""
        if not skills:
            return np.zeros(384)  # Default embedding size for MiniLM

        # Combine skills into a single text
        skills_text = ", ".join(skills)
        return self.get_embedding(skills_text)

    def calculate_similarity(self, skills1: list, skills2: list) -> float:
        """Calculate semantic similarity between two skill sets."""
        if not skills1 or not skills2:
            return 0.0

        emb1 = self.get_skills_embedding(skills1)
        emb2 = self.get_skills_embedding(skills2)

        # Reshape for cosine_similarity
        emb1 = emb1.reshape(1, -1)
        emb2 = emb2.reshape(1, -1)

        similarity = cosine_similarity(emb1, emb2)[0][0]

        # Normalize to 0-1 range (cosine similarity can be negative)
        return max(0, float(similarity))

    def find_matching_skills(self, candidate_skills: list, job_requirements: list, threshold: float = 0.7) -> list:
        """Find which candidate skills match job requirements."""
        matches = []

        for job_skill in job_requirements:
            job_emb = self.get_embedding(job_skill)

            best_match = None
            best_score = 0

            for candidate_skill in candidate_skills:
                cand_emb = self.get_embedding(candidate_skill)

                similarity = cosine_similarity(
                    job_emb.reshape(1, -1),
                    cand_emb.reshape(1, -1)
                )[0][0]

                if similarity > best_score:
                    best_score = similarity
                    best_match = candidate_skill

            if best_score >= threshold:
                matches.append({
                    'job_requirement': job_skill,
                    'matched_skill': best_match,
                    'score': float(best_score)
                })

        return matches

    def clear_cache(self):
        """Clear the embeddings cache."""
        self._embeddings_cache.clear()
