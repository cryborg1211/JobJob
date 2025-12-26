from typing import Dict, List
import numpy as np


def normalize_score(score: float, min_val: float = 0, max_val: float = 1) -> float:
    """Normalize a score to a 0-1 range."""
    if max_val == min_val:
        return 0.5

    normalized = (score - min_val) / (max_val - min_val)
    return max(0.0, min(1.0, normalized))


def calculate_weighted_score(scores: Dict[str, float], weights: Dict[str, float]) -> float:
    """Calculate a weighted average score."""
    total_weight = sum(weights.values())

    if total_weight == 0:
        return 0.0

    weighted_sum = sum(
        scores.get(key, 0) * weight
        for key, weight in weights.items()
    )

    return weighted_sum / total_weight


def jaccard_similarity(set1: set, set2: set) -> float:
    """Calculate Jaccard similarity between two sets."""
    if not set1 or not set2:
        return 0.0

    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))

    return intersection / union if union > 0 else 0.0


def dice_coefficient(set1: set, set2: set) -> float:
    """Calculate Dice coefficient between two sets."""
    if not set1 or not set2:
        return 0.0

    intersection = len(set1.intersection(set2))
    return (2 * intersection) / (len(set1) + len(set2))


def overlap_coefficient(set1: set, set2: set) -> float:
    """Calculate Overlap coefficient (Szymkiewicz-Simpson)."""
    if not set1 or not set2:
        return 0.0

    intersection = len(set1.intersection(set2))
    min_size = min(len(set1), len(set2))

    return intersection / min_size if min_size > 0 else 0.0


def calculate_skill_coverage(candidate_skills: List[str], required_skills: List[str]) -> Dict:
    """Calculate how well candidate skills cover job requirements."""
    if not required_skills:
        return {
            'coverage': 1.0,
            'matched': [],
            'missing': []
        }

    candidate_set = set(s.lower() for s in candidate_skills)
    required_set = set(s.lower() for s in required_skills)

    matched = candidate_set.intersection(required_set)
    missing = required_set - matched

    return {
        'coverage': len(matched) / len(required_set),
        'matched': list(matched),
        'missing': list(missing)
    }


def calculate_experience_match(
    candidate_years: float,
    min_required: float,
    max_preferred: float = None
) -> float:
    """Calculate experience match score."""
    if candidate_years < 0:
        return 0.0

    if max_preferred is None:
        max_preferred = min_required + 3

    if candidate_years < min_required:
        # Underqualified - linear penalty
        return max(0.0, candidate_years / min_required)

    elif candidate_years <= max_preferred:
        # In the sweet spot
        return 1.0

    else:
        # Overqualified - slight penalty
        excess = candidate_years - max_preferred
        return max(0.5, 1.0 - (excess * 0.05))


def calculate_salary_match(
    candidate_expected: float,
    job_min: float,
    job_max: float
) -> float:
    """Calculate salary expectation match score."""
    if candidate_expected <= 0 or job_max <= 0:
        return 0.5  # Neutral if missing info

    if job_min <= candidate_expected <= job_max:
        # Perfect fit
        return 1.0

    elif candidate_expected < job_min:
        # Candidate expects less - good for employer
        return 0.9

    else:
        # Candidate expects more
        excess_ratio = candidate_expected / job_max
        return max(0.0, 2.0 - excess_ratio)


def rank_matches(matches: List[Dict], key: str = 'score') -> List[Dict]:
    """Rank matches by score, highest first."""
    return sorted(matches, key=lambda x: x.get(key, 0), reverse=True)


def percentile_rank(score: float, all_scores: List[float]) -> float:
    """Calculate percentile rank of a score within a distribution."""
    if not all_scores:
        return 0.5

    all_scores = sorted(all_scores)
    below_count = sum(1 for s in all_scores if s < score)

    return below_count / len(all_scores)
