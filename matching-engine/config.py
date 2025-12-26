import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost:5432/jobjob')
    PORT = int(os.getenv('MATCHING_ENGINE_PORT', 5001))
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

    # Model configuration
    EMBEDDING_MODEL = 'all-MiniLM-L6-v2'  # Fast and efficient for semantic similarity

    # Matching weights
    WEIGHTS = {
        'skills': 0.4,
        'experience': 0.25,
        'location': 0.2,
        'salary': 0.15
    }
