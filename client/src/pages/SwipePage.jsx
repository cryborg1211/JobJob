import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { X, Heart, MapPin, DollarSign, Briefcase, User, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const SwipeCard = ({ item, isEmployer, onSwipe }) => {
    const [dragDirection, setDragDirection] = useState(null);

    return (
        <motion.div
            className="absolute w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDrag={(e, info) => {
                if (info.offset.x > 50) setDragDirection('right');
                else if (info.offset.x < -50) setDragDirection('left');
                else setDragDirection(null);
            }}
            onDragEnd={(e, info) => {
                if (info.offset.x > 100) {
                    onSwipe('like');
                } else if (info.offset.x < -100) {
                    onSwipe('pass');
                }
                setDragDirection(null);
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
                x: dragDirection === 'right' ? 300 : dragDirection === 'left' ? -300 : 0,
                opacity: 0,
                transition: { duration: 0.3 }
            }}
            whileDrag={{ cursor: 'grabbing' }}
            style={{ cursor: 'grab' }}
        >
            <div className={`bg-surface border-2 rounded-3xl p-8 shadow-2xl transition-colors ${
                dragDirection === 'right' ? 'border-green-500' :
                dragDirection === 'left' ? 'border-red-500' :
                'border-white/10'
            }`}>
                {isEmployer ? (
                    // Candidate Card
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{item.username}</h2>
                                <p className="text-text-muted">{item.experience || 'Chưa cập nhật kinh nghiệm'}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-text-muted mb-2">Kỹ năng</h3>
                            <div className="flex flex-wrap gap-2">
                                {(item.skills || []).length > 0 ? (
                                    item.skills.map((skill, i) => (
                                        <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-text-muted text-sm">Chưa cập nhật</span>
                                )}
                            </div>
                        </div>

                        {item.matchScore && (
                            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                                <div className="text-green-400 font-medium">
                                    Độ phù hợp: {Math.round(item.matchScore * 100)}%
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Job Card
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                        <p className="text-primary font-medium mb-4">
                            {item.employer?.companyName || item.employer?.username}
                        </p>

                        <p className="text-text-muted mb-6 line-clamp-3">{item.description}</p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-text-muted">
                                <MapPin className="w-4 h-4" />
                                <span>{item.location}</span>
                            </div>
                            {item.salary && (
                                <div className="flex items-center gap-2 text-text-muted">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{item.salary.toLocaleString()} VND</span>
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-text-muted mb-2">Yêu cầu</h3>
                            <div className="flex flex-wrap gap-2">
                                {(item.requirements || []).map((req, i) => (
                                    <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {item.matchScore && (
                            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                                <div className="text-green-400 font-medium">
                                    Độ phù hợp: {Math.round(item.matchScore * 100)}%
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const SwipePage = () => {
    const { user } = useAuth();
    const isEmployer = user?.role === 'employer';
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            let url;

            if (isEmployer) {
                url = `${API_URL}/users/candidates/all?limit=20`;
            } else {
                url = `${API_URL}/jobs?limit=20`;
            }

            const res = await fetch(url, {
                headers: { 'x-auth-token': token }
            });

            const data = await res.json();

            if (isEmployer) {
                setItems(data.candidates || []);
            } else {
                setItems(data.jobs || []);
            }
        } catch (err) {
            setError('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [isEmployer]);

    const handleSwipe = async (type) => {
        if (items.length === 0) return;

        const currentItem = items[0];
        const token = localStorage.getItem('token');

        try {
            await fetch(`${API_URL}/interactions/swipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    targetId: currentItem.id,
                    type,
                    targetType: isEmployer ? 'user' : 'job'
                })
            });

            setItems(prev => prev.slice(1));
        } catch (err) {
            console.error('Swipe error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-lg mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">
                        {isEmployer ? 'Tìm Ứng Viên' : 'Tìm Việc Làm'}
                    </h1>
                    <p className="text-text-muted">
                        Vuốt phải để thích, vuốt trái để bỏ qua
                    </p>
                </div>

                {/* Card Stack */}
                <div className="relative h-[500px] mb-8">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-red-400 mb-4">{error}</p>
                                <button
                                    onClick={fetchItems}
                                    className="bg-primary text-black px-6 py-2 rounded-full font-medium"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <Briefcase className="w-16 h-16 text-text-muted mx-auto mb-4" />
                                <p className="text-text-muted mb-4">
                                    {isEmployer ? 'Không có ứng viên mới' : 'Không có việc làm mới'}
                                </p>
                                <button
                                    onClick={fetchItems}
                                    className="bg-primary text-black px-6 py-2 rounded-full font-medium"
                                >
                                    Tải lại
                                </button>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {items.slice(0, 3).map((item, index) => (
                                <div
                                    key={item.id}
                                    style={{
                                        zIndex: items.length - index,
                                        transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`
                                    }}
                                    className="absolute w-full"
                                >
                                    {index === 0 ? (
                                        <SwipeCard
                                            item={item}
                                            isEmployer={isEmployer}
                                            onSwipe={handleSwipe}
                                        />
                                    ) : (
                                        <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-xl opacity-50" />
                                    )}
                                </div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Action Buttons */}
                {items.length > 0 && !loading && (
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => handleSwipe('pass')}
                            className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
                        >
                            <X className="w-8 h-8 text-red-400" />
                        </button>
                        <button
                            onClick={() => handleSwipe('like')}
                            className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                            <Heart className="w-8 h-8 text-green-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwipePage;
