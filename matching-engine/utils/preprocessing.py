import re
from typing import List


def preprocess_text(text: str) -> str:
    """Clean and normalize text for processing."""
    if not text:
        return ""

    # Convert to lowercase
    text = text.lower()

    # Remove special characters except spaces and hyphens
    text = re.sub(r'[^a-z0-9\s\-]', ' ', text)

    # Normalize whitespace
    text = ' '.join(text.split())

    return text


def extract_skills(text: str, skill_keywords: List[str] = None) -> List[str]:
    """Extract skills from a text description."""
    if not text:
        return []

    # Common tech skills to look for
    default_skills = [
        'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'rust',
        'react', 'vue', 'angular', 'node', 'express', 'django', 'flask', 'fastapi',
        'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
        'git', 'ci/cd', 'jenkins', 'github actions',
        'machine learning', 'deep learning', 'nlp', 'computer vision',
        'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
        'html', 'css', 'sass', 'tailwind', 'bootstrap',
        'rest api', 'graphql', 'microservices', 'api design',
        'agile', 'scrum', 'project management', 'leadership',
        'communication', 'teamwork', 'problem solving'
    ]

    skills_to_find = skill_keywords if skill_keywords else default_skills

    text_lower = text.lower()
    found_skills = []

    for skill in skills_to_find:
        if skill in text_lower:
            found_skills.append(skill)

    return found_skills


def normalize_skills(skills: List[str]) -> List[str]:
    """Normalize skill names for consistent matching."""
    skill_aliases = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'nodejs': 'node',
        'node.js': 'node',
        'react.js': 'react',
        'reactjs': 'react',
        'vue.js': 'vue',
        'vuejs': 'vue',
        'angular.js': 'angular',
        'angularjs': 'angular',
        'postgres': 'postgresql',
        'mongo': 'mongodb',
        'k8s': 'kubernetes',
        'ml': 'machine learning',
        'dl': 'deep learning',
        'ai': 'artificial intelligence'
    }

    normalized = []
    for skill in skills:
        skill_lower = skill.lower().strip()
        normalized_skill = skill_aliases.get(skill_lower, skill_lower)
        if normalized_skill not in normalized:
            normalized.append(normalized_skill)

    return normalized


def tokenize(text: str) -> List[str]:
    """Tokenize text into words."""
    if not text:
        return []

    # Remove punctuation and split
    text = re.sub(r'[^\w\s]', ' ', text)
    tokens = text.lower().split()

    # Remove stopwords
    stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
                 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
                 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
                 'we', 'you', 'i', 'he', 'she', 'it', 'they', 'them', 'their', 'our',
                 'your', 'my', 'this', 'that', 'these', 'those', 'as', 'if', 'when',
                 'where', 'what', 'which', 'who', 'whom', 'how', 'all', 'each', 'every',
                 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
                 'only', 'own', 'same', 'so', 'than', 'too', 'very'}

    return [t for t in tokens if t not in stopwords and len(t) > 1]
