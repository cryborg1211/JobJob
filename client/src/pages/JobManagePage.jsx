import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Briefcase, Plus, MapPin, DollarSign, Edit2, Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const JobManagePage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/jobs/employer/me`, {
                headers: { 'x-auth-token': token }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch jobs');
            }

            const data = await res.json();
            setJobs(data || []);
        } catch (err) {
            setError('Không thể tải danh sách việc làm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (!confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;

        setDeletingId(jobId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                setJobs(jobs.filter(j => j.id !== jobId));
            } else {
                throw new Error('Delete failed');
            }
        } catch (err) {
            alert('Không thể xóa tin tuyển dụng');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleStatus = async (jobId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' })
            });

            if (res.ok) {
                setJobs(jobs.map(j =>
                    j.id === jobId
                        ? { ...j, status: currentStatus === 'active' ? 'inactive' : 'active' }
                        : j
                ));
            }
        } catch (err) {
            console.error('Toggle status error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Quản Lý Việc Làm</h1>
                        <p className="text-text-muted">
                            {jobs.length} tin tuyển dụng
                        </p>
                    </div>
                    <Link
                        to="/jobs/create"
                        className="flex items-center gap-2 bg-primary text-black px-5 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Đăng tin mới
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={fetchJobs}
                            className="bg-primary text-black px-6 py-2 rounded-full font-medium"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <Briefcase className="w-16 h-16 text-text-muted mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Chưa có tin tuyển dụng</h2>
                        <p className="text-text-muted mb-6">
                            Đăng tin tuyển dụng đầu tiên để bắt đầu tìm ứng viên
                        </p>
                        <Link
                            to="/jobs/create"
                            className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Đăng tin ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className={`bg-surface border rounded-2xl p-6 transition-colors ${
                                    job.status === 'inactive'
                                        ? 'border-white/5 opacity-60'
                                        : 'border-white/10'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold truncate">
                                                {job.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                job.status === 'active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {job.status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}
                                            </span>
                                        </div>

                                        <p className="text-text-muted text-sm mb-4 line-clamp-2">
                                            {job.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                                            {job.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{job.location}</span>
                                                </div>
                                            )}
                                            {job.salary && (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>{job.salary.toLocaleString()} VND</span>
                                                </div>
                                            )}
                                        </div>

                                        {job.requirements?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {job.requirements.slice(0, 4).map((req, i) => (
                                                    <span
                                                        key={i}
                                                        className="bg-primary/10 text-primary/80 px-2 py-1 rounded-full text-xs"
                                                    >
                                                        {req}
                                                    </span>
                                                ))}
                                                {job.requirements.length > 4 && (
                                                    <span className="text-text-muted text-xs">
                                                        +{job.requirements.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleStatus(job.id, job.status)}
                                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                            title={job.status === 'active' ? 'Ẩn tin' : 'Hiện tin'}
                                        >
                                            {job.status === 'active' ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                        <Link
                                            to={`/jobs/edit/${job.id}`}
                                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            disabled={deletingId === job.id}
                                            className="p-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobManagePage;
