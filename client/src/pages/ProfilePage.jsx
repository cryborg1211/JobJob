import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { authFetch } from '../config/api';
import { User, Briefcase, Save, Plus, X } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();
    const isEmployer = user?.role === 'employer';

    const [formData, setFormData] = useState({
        username: '',
        skills: [],
        experience: '',
        companyName: '',
        companyWebsite: ''
    });
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await authFetch('/users/me');

            if (!res.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await res.json();

            setFormData({
                username: data.username || '',
                skills: data.skills || [],
                experience: data.experience || '',
                companyName: data.companyName || '',
                companyWebsite: data.companyWebsite || ''
            });
        } catch (err) {
            setMessage({ type: 'error', text: 'Không thể tải thông tin' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await authFetch('/users/me', {
                method: 'PUT',
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Cập nhật thành công!' });
            } else {
                const data = await res.json();
                throw new Error(data.msg || 'Update failed');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Cập nhật thất bại' });
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skillToRemove)
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        {isEmployer ? (
                            <Briefcase className="w-8 h-8 text-primary" />
                        ) : (
                            <User className="w-8 h-8 text-primary" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Hồ Sơ Của Bạn</h1>
                        <p className="text-text-muted">
                            {isEmployer ? 'Nhà tuyển dụng' : 'Ứng viên'}
                        </p>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl ${
                        message.type === 'success'
                            ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                            : 'bg-red-500/20 border border-red-500/30 text-red-400'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-surface border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    {isEmployer ? (
                        <div className="bg-surface border border-white/10 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Thông tin công ty</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">
                                        Tên công ty
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">
                                        Website công ty
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.companyWebsite}
                                        onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                                        placeholder="https://"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-surface border border-white/10 rounded-2xl p-6">
                                <h2 className="text-lg font-semibold mb-4">Kỹ năng</h2>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
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
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        placeholder="Thêm kỹ năng..."
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="bg-primary/20 text-primary px-4 rounded-xl hover:bg-primary/30 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-surface border border-white/10 rounded-2xl p-6">
                                <h2 className="text-lg font-semibold mb-4">Kinh nghiệm</h2>

                                <textarea
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    rows={4}
                                    placeholder="Mô tả kinh nghiệm làm việc của bạn..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 resize-none"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
