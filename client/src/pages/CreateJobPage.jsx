import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const CreateJobPage = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [newRequirement, setNewRequirement] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        requirements: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addRequirement = () => {
        if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }));
            setNewRequirement('');
        }
    };

    const removeRequirement = (req) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter(r => r !== req)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Vui lòng nhập tiêu đề công việc');
            return;
        }
        if (!formData.description.trim()) {
            setError('Vui lòng nhập mô tả công việc');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    ...formData,
                    salary: formData.salary ? Number(formData.salary) : null
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.msg || 'Failed to create job');
            }

            navigate('/jobs/manage');
        } catch (err) {
            setError(err.message || 'Không thể tạo tin tuyển dụng');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                </button>

                <h1 className="text-3xl font-bold mb-8">Đăng Tin Tuyển Dụng</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-surface border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Tiêu đề công việc *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="VD: Senior React Developer"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Mô tả công việc *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Mô tả chi tiết về công việc, trách nhiệm, quyền lợi..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Chi tiết</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Địa điểm
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="VD: Hà Nội, Remote, TP.HCM"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Mức lương (VND)
                                </label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="VD: 25000000"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Yêu cầu ứng viên</h2>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.requirements.map((req, i) => (
                                <span
                                    key={i}
                                    className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                    {req}
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(req)}
                                        className="hover:text-white"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newRequirement}
                                onChange={(e) => setNewRequirement(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                placeholder="VD: React, TypeScript, 3 năm kinh nghiệm..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary/50"
                            />
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="bg-primary/20 text-primary px-4 rounded-xl hover:bg-primary/30 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Đang tạo...' : 'Đăng tin tuyển dụng'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateJobPage;
