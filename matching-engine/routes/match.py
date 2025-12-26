from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import text
from models import JobRanker

match_bp = Blueprint('match', __name__)
job_ranker = JobRanker()


def get_session():
    """Get database session from app config."""
    Session = current_app.config['Session']
    return Session()


@match_bp.route('/jobs/<candidate_id>', methods=['GET'])
def get_matched_jobs(candidate_id):
    """Get ranked jobs for a candidate."""
    session = get_session()
    try:
        limit = request.args.get('limit', 10, type=int)

        # Get candidate
        result = session.execute(
            text("SELECT * FROM users WHERE id = :id AND role = 'candidate'"),
            {'id': candidate_id}
        )
        candidate_row = result.fetchone()

        if not candidate_row:
            return jsonify({'error': 'Candidate not found'}), 404

        candidate = dict(candidate_row._mapping)

        # Get candidate's interaction history (to exclude already seen jobs)
        interactions = session.execute(
            text('SELECT "targetJobId" FROM interactions WHERE "userId" = :user_id AND "targetJobId" IS NOT NULL'),
            {'user_id': candidate_id}
        ).fetchall()
        seen_job_ids = [str(i[0]) for i in interactions]

        # Get available jobs (excluding seen ones)
        if seen_job_ids:
            jobs_result = session.execute(
                text("SELECT * FROM jobs WHERE id NOT IN :seen_ids LIMIT 100"),
                {'seen_ids': tuple(seen_job_ids) if seen_job_ids else ('',)}
            )
        else:
            jobs_result = session.execute(text("SELECT * FROM jobs LIMIT 100"))

        jobs = [dict(row._mapping) for row in jobs_result.fetchall()]

        if not jobs:
            return jsonify({
                'matches': [],
                'message': 'No new jobs available'
            })

        # Convert candidate for matching
        candidate_for_match = {
            'id': candidate['id'],
            'candidateProfile': {
                'skills': candidate.get('skills', []) or [],
                'experience': candidate.get('experience', '')
            }
        }

        # Rank jobs for candidate
        ranked_jobs = job_ranker.rank_jobs_for_candidate(
            candidate_for_match, jobs, limit=limit
        )

        # Format response
        results = []
        for item in ranked_jobs:
            job = item['job']
            results.append({
                'job': {
                    'id': job['id'],
                    'title': job['title'],
                    'description': job['description'],
                    'requirements': job.get('requirements', []),
                    'salary': job.get('salary'),
                    'location': job['location'],
                    'employerId': job['employerId']
                },
                'matchScore': item['match']['total_score'],
                'breakdown': item['match']['breakdown'],
                'matchedSkills': item['match']['matched_skills']
            })

        return jsonify({
            'matches': results,
            'candidateId': candidate_id,
            'total': len(results)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@match_bp.route('/candidates/<job_id>', methods=['GET'])
def get_matched_candidates(job_id):
    """Get ranked candidates for a job."""
    session = get_session()
    try:
        limit = request.args.get('limit', 10, type=int)

        # Get job
        result = session.execute(
            text("SELECT * FROM jobs WHERE id = :id"),
            {'id': job_id}
        )
        job_row = result.fetchone()

        if not job_row:
            return jsonify({'error': 'Job not found'}), 404

        job = dict(job_row._mapping)

        # Get employer's interaction history (to exclude already seen candidates)
        interactions = session.execute(
            text('SELECT "targetUserId" FROM interactions WHERE "userId" = :user_id AND "targetUserId" IS NOT NULL'),
            {'user_id': job['employerId']}
        ).fetchall()
        seen_candidate_ids = [str(i[0]) for i in interactions]

        # Get available candidates (excluding seen ones)
        if seen_candidate_ids:
            candidates_result = session.execute(
                text("SELECT * FROM users WHERE role = 'candidate' AND id NOT IN :seen_ids LIMIT 100"),
                {'seen_ids': tuple(seen_candidate_ids) if seen_candidate_ids else ('',)}
            )
        else:
            candidates_result = session.execute(
                text("SELECT * FROM users WHERE role = 'candidate' LIMIT 100")
            )

        candidates = [dict(row._mapping) for row in candidates_result.fetchall()]

        if not candidates:
            return jsonify({
                'matches': [],
                'message': 'No new candidates available'
            })

        # Convert candidates for matching
        candidates_for_match = [{
            'id': c['id'],
            'username': c['username'],
            'candidateProfile': {
                'skills': c.get('skills', []) or [],
                'experience': c.get('experience', '')
            }
        } for c in candidates]

        # Rank candidates for job
        ranked_candidates = job_ranker.rank_candidates_for_job(
            job, candidates_for_match, limit=limit
        )

        # Format response
        results = []
        for item in ranked_candidates:
            results.append({
                'candidate': item['candidate'],
                'matchScore': item['match']['total_score'],
                'breakdown': item['match']['breakdown'],
                'matchedSkills': item['match']['matched_skills']
            })

        return jsonify({
            'matches': results,
            'jobId': job_id,
            'total': len(results)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@match_bp.route('/score', methods=['POST'])
def calculate_score():
    """Calculate match score between a specific candidate and job."""
    session = get_session()
    try:
        data = request.get_json()

        candidate_id = data.get('candidateId')
        job_id = data.get('jobId')

        if not candidate_id or not job_id:
            return jsonify({'error': 'candidateId and jobId are required'}), 400

        # Get candidate
        result = session.execute(
            text("SELECT * FROM users WHERE id = :id AND role = 'candidate'"),
            {'id': candidate_id}
        )
        candidate_row = result.fetchone()

        if not candidate_row:
            return jsonify({'error': 'Candidate not found'}), 404

        candidate = dict(candidate_row._mapping)

        # Get job
        result = session.execute(
            text("SELECT * FROM jobs WHERE id = :id"),
            {'id': job_id}
        )
        job_row = result.fetchone()

        if not job_row:
            return jsonify({'error': 'Job not found'}), 404

        job = dict(job_row._mapping)

        # Convert for matching
        candidate_for_match = {
            'candidateProfile': {
                'skills': candidate.get('skills', []) or [],
                'experience': candidate.get('experience', '')
            }
        }

        # Calculate match
        match_result = job_ranker.calculate_match_score(candidate_for_match, job)

        return jsonify({
            'candidateId': candidate_id,
            'jobId': job_id,
            'matchScore': match_result['total_score'],
            'breakdown': match_result['breakdown'],
            'matchedSkills': match_result['matched_skills'],
            'weights': match_result['weights_used']
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@match_bp.route('/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    """Get daily recommendations for a user (works for both candidates and employers)."""
    session = get_session()
    try:
        limit = request.args.get('limit', 5, type=int)

        # Get user
        result = session.execute(
            text("SELECT * FROM users WHERE id = :id"),
            {'id': user_id}
        )
        user_row = result.fetchone()

        if not user_row:
            return jsonify({'error': 'User not found'}), 404

        user = dict(user_row._mapping)

        if user['role'] == 'candidate':
            # Get seen job IDs
            interactions = session.execute(
                text('SELECT "targetJobId" FROM interactions WHERE "userId" = :user_id AND "targetJobId" IS NOT NULL'),
                {'user_id': user_id}
            ).fetchall()
            seen_ids = [str(i[0]) for i in interactions]

            # Get job recommendations
            if seen_ids:
                jobs_result = session.execute(
                    text("SELECT * FROM jobs WHERE id NOT IN :seen_ids LIMIT 50"),
                    {'seen_ids': tuple(seen_ids) if seen_ids else ('',)}
                )
            else:
                jobs_result = session.execute(text("SELECT * FROM jobs LIMIT 50"))

            jobs = [dict(row._mapping) for row in jobs_result.fetchall()]

            if not jobs:
                return jsonify({'recommendations': [], 'type': 'jobs'})

            user_for_match = {
                'candidateProfile': {
                    'skills': user.get('skills', []) or [],
                    'experience': user.get('experience', '')
                }
            }

            ranked = job_ranker.rank_jobs_for_candidate(user_for_match, jobs, limit=limit)

            recommendations = []
            for item in ranked:
                job = item['job']
                recommendations.append({
                    'type': 'job',
                    'data': {
                        'id': job['id'],
                        'title': job['title'],
                        'description': job['description'],
                        'salary': job.get('salary'),
                        'location': job['location']
                    },
                    'matchScore': item['match']['total_score'],
                    'reason': f"Matches {len(item['match']['matched_skills'])} of your skills"
                })

            return jsonify({
                'recommendations': recommendations,
                'userId': user_id,
                'userType': 'candidate'
            })

        else:
            # Get employer's jobs
            jobs_result = session.execute(
                text('SELECT * FROM jobs WHERE "employerId" = :employer_id'),
                {'employer_id': user_id}
            )
            employer_jobs = [dict(row._mapping) for row in jobs_result.fetchall()]

            if not employer_jobs:
                return jsonify({
                    'recommendations': [],
                    'message': 'Create job postings first'
                })

            # Get seen candidate IDs
            interactions = session.execute(
                text('SELECT "targetUserId" FROM interactions WHERE "userId" = :user_id AND "targetUserId" IS NOT NULL'),
                {'user_id': user_id}
            ).fetchall()
            seen_ids = [str(i[0]) for i in interactions]

            # Get candidates
            if seen_ids:
                candidates_result = session.execute(
                    text("SELECT * FROM users WHERE role = 'candidate' AND id NOT IN :seen_ids LIMIT 50"),
                    {'seen_ids': tuple(seen_ids) if seen_ids else ('',)}
                )
            else:
                candidates_result = session.execute(
                    text("SELECT * FROM users WHERE role = 'candidate' LIMIT 50")
                )

            candidates = [dict(row._mapping) for row in candidates_result.fetchall()]

            if not candidates:
                return jsonify({'recommendations': [], 'type': 'candidates'})

            candidates_for_match = [{
                'id': c['id'],
                'username': c['username'],
                'candidateProfile': {
                    'skills': c.get('skills', []) or [],
                    'experience': c.get('experience', '')
                }
            } for c in candidates]

            ranked = job_ranker.rank_candidates_for_job(
                employer_jobs[0], candidates_for_match, limit=limit
            )

            recommendations = []
            for item in ranked:
                recommendations.append({
                    'type': 'candidate',
                    'data': item['candidate'],
                    'matchScore': item['match']['total_score'],
                    'forJob': {
                        'id': employer_jobs[0]['id'],
                        'title': employer_jobs[0]['title']
                    },
                    'reason': f"Matches {len(item['match']['matched_skills'])} requirements"
                })

            return jsonify({
                'recommendations': recommendations,
                'userId': user_id,
                'userType': 'employer'
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()
