from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import Config
from routes.match import match_bp

app = Flask(__name__)
CORS(app)

# PostgreSQL connection
engine = create_engine(Config.DATABASE_URL)
Session = sessionmaker(bind=engine)

# Store session factory for routes
app.config['Session'] = Session

# Register blueprints
app.register_blueprint(match_bp, url_prefix='/api/match')

@app.route('/')
def health_check():
    return {'status': 'ok', 'service': 'JobJob Matching Engine'}

@app.route('/api/health')
def api_health():
    try:
        # Check PostgreSQL connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {'status': 'healthy', 'database': 'connected'}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}, 500

if __name__ == '__main__':
    print(f"Starting JobJob Matching Engine on port {Config.PORT}")
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
