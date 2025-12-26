from typing import List, Dict, Any
from .skill_matcher import SkillMatcher
from config import Config


class JobRanker:
    """ML-based job ranking system."""

    def __init__(self):
        self.skill_matcher = SkillMatcher()
        self.weights = Config.WEIGHTS

    def calculate_experience_score(self, candidate_exp: str, job_exp_required: str = None) -> float:
        """Calculate experience level match score."""
        if not candidate_exp:
            return 0.5  # Neutral score if no experience info

        # Define experience levels
        exp_levels = {
            'intern': 0,
            'fresher': 1,
            'junior': 2,
            '1-2 years': 2,
            '2-3 years': 3,
            'mid': 3,
            '3-5 years': 4,
            'senior': 5,
            '5+ years': 5,
            'lead': 6,
            'manager': 7,
            'director': 8
        }

        candidate_level = None
        job_level = None

        # Find candidate level
        for key, level in exp_levels.items():
            if key in candidate_exp.lower():
                candidate_level = level
                break

        if candidate_level is None:
            return 0.5  # Default if can't determine

        if not job_exp_required:
            return 0.7  # Good score if job doesn't specify

        # Find job required level
        for key, level in exp_levels.items():
            if key in job_exp_required.lower():
                job_level = level
                break

        if job_level is None:
            return 0.7

        # Calculate score based on level difference
        diff = candidate_level - job_level

        if diff == 0:
            return 1.0  # Perfect match
        elif diff > 0:
            # Overqualified - slight penalty
            return max(0.5, 1.0 - (diff * 0.1))
        else:
            # Underqualified - larger penalty
            return max(0.0, 1.0 + (diff * 0.2))

    def calculate_location_score(self, candidate_location: str, job_location: str) -> float:
        """Calculate location match score."""
        if not candidate_location or not job_location:
            return 0.5  # Neutral if missing info

        # Normalize locations
        cand_loc = candidate_location.lower().strip()
        job_loc = job_location.lower().strip()

        # Exact match
        if cand_loc == job_loc:
            return 1.0

        # Partial match (e.g., "Ho Chi Minh" in "Ho Chi Minh City")
        if cand_loc in job_loc or job_loc in cand_loc:
            return 0.9

        # Check for remote work keywords
        remote_keywords = ['remote', 'work from home', 'wfh', 'anywhere']
        if any(kw in job_loc for kw in remote_keywords):
            return 0.95

        # Different locations
        return 0.3

    def calculate_salary_score(self, candidate_expected: float, job_salary: float) -> float:
        """Calculate salary expectation match score."""
        if not candidate_expected or not job_salary:
            return 0.5  # Neutral if missing info

        ratio = job_salary / candidate_expected

        if ratio >= 1.0:
            # Job pays equal or more than expected
            return min(1.0, 0.8 + (ratio - 1.0) * 0.2)
        else:
            # Job pays less than expected
            return max(0.0, ratio)

    def calculate_match_score(
        self,
        candidate: Dict[str, Any],
        job: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculate overall match score between candidate and job."""

        # Extract data
        candidate_skills = candidate.get('candidateProfile', {}).get('skills', [])
        candidate_exp = candidate.get('candidateProfile', {}).get('experience', '')
        candidate_location = candidate.get('location', '')
        candidate_salary = candidate.get('expectedSalary', 0)

        job_requirements = job.get('requirements', [])
        job_location = job.get('location', '')
        job_salary = job.get('salary', 0)

        # Calculate individual scores
        skill_score = self.skill_matcher.calculate_similarity(
            candidate_skills, job_requirements
        )

        experience_score = self.calculate_experience_score(candidate_exp)

        location_score = self.calculate_location_score(
            candidate_location, job_location
        )

        salary_score = self.calculate_salary_score(
            candidate_salary, job_salary
        ) if candidate_salary and job_salary else 0.5

        # Calculate weighted total
        total_score = (
            skill_score * self.weights['skills'] +
            experience_score * self.weights['experience'] +
            location_score * self.weights['location'] +
            salary_score * self.weights['salary']
        )

        # Find matched skills
        matched_skills = self.skill_matcher.find_matching_skills(
            candidate_skills, job_requirements, threshold=0.6
        )

        return {
            'total_score': round(total_score, 3),
            'breakdown': {
                'skills': round(skill_score, 3),
                'experience': round(experience_score, 3),
                'location': round(location_score, 3),
                'salary': round(salary_score, 3)
            },
            'matched_skills': matched_skills,
            'weights_used': self.weights
        }

    def rank_jobs_for_candidate(
        self,
        candidate: Dict[str, Any],
        jobs: List[Dict[str, Any]],
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Rank jobs for a candidate, returning top matches."""

        scored_jobs = []

        for job in jobs:
            match_result = self.calculate_match_score(candidate, job)
            scored_jobs.append({
                'job': job,
                'match': match_result
            })

        # Sort by total score descending
        scored_jobs.sort(key=lambda x: x['match']['total_score'], reverse=True)

        return scored_jobs[:limit]

    def rank_candidates_for_job(
        self,
        job: Dict[str, Any],
        candidates: List[Dict[str, Any]],
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Rank candidates for a job, returning top matches."""

        scored_candidates = []

        for candidate in candidates:
            match_result = self.calculate_match_score(candidate, job)
            scored_candidates.append({
                'candidate': {
                    '_id': str(candidate.get('_id', '')),
                    'username': candidate.get('username', ''),
                    'candidateProfile': candidate.get('candidateProfile', {})
                },
                'match': match_result
            })

        # Sort by total score descending
        scored_candidates.sort(key=lambda x: x['match']['total_score'], reverse=True)

        return scored_candidates[:limit]
