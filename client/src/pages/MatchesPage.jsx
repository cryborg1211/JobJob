import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Heart, Briefcase, User, MapPin, DollarSign, ExternalLink, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const MatchesPage = () => {
    const { user } = useAuth();
    const isEmployer = user?.role === 'employer';
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMatches = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/interactions/matches`, {
                headers: { 'x-auth-token': token }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch matches');
            }

            const data = await res.json();
            setMatches(data);
        } catch (err) {
            setError('Không thể tải danh sách matches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Matches</h1>
                        <p className="text-text-muted">
                            {isEmployer
                                ? 'Ứng viên đã quan tâm đến công việc của bạn'
                                : 'Nhà tuyển dụng đã quan tâm đến bạn'
                            }
                        </p>
                    </div>
                    <button
                        onClick={fetchMatches}
                        className="p-3 bg-surface border border-white/10 rounded-xl hover:border-primary/50 transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={fetchMatches}
                            className="bg-primary text-black px-6 py-2 rounded-full font-medium"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-16 h-16 text-text-muted mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Chưa có matches nào</h2>
                        <p className="text-text-muted mb-6">
                            Tiếp tục lướt để tìm {isEmployer ? 'ứng viên' : 'công việc'} phù hợp
                        </p>
                        <Link
                            to="/swipe"
                            className="inline-block bg-primary text-black px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            Tiếp tục tìm kiếm
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {matches.map((match, index) => (
                            <div
                                key={index}
                                className="bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors"
                            >
                                {isEmployer ? (
                                    // Employer view - show candidate info
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semibold mb-1">
                                                {match.candidate?.username}
                                            </h3>
                                            <p className="text-text-muted text-sm mb-3">
                                                {match.candidate?.experience || 'Chưa cập nhật kinh nghiệm'}
                                            </p>

                                            {match.candidate?.skills?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {match.candidate.skills.slice(0, 5).map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {match.candidate.skills.length > 5 && (
                                                        <span className="text-text-muted text-xs">
                                                            +{match.candidate.skills.length - 5} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {match.job && (
                                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-sm">
                                                    <span className="text-green-400">Matched với:</span>{' '}
                                                    <span className="text-white">{match.job.title}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-text-muted">
                                            {new Date(match.matchedAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                ) : (
                                    // Candidate view - show job info
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semibold mb-1">
                                                {match.job?.title}
                                            </h3>
                                            <p className="text-primary font-medium text-sm mb-2">
                                                {match.employer?.companyName || match.employer?.username}
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-3">
                                                {match.job?.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{match.job.location}</span>
                                                    </div>
                                                )}
                                                {match.job?.salary && (
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4" />
                                                        <span>{match.job.salary.toLocaleString()} VND</span>
                                                    </div>
                                                )}
                                            </div>

                                            {match.employer?.companyWebsite && (
                                                <a
                                                    href={match.employer.companyWebsite}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Website công ty
                                                </a>
                                            )}
                                        </div>
                                        <div className="text-xs text-text-muted">
                                            {new Date(match.matchedAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchesPage;
