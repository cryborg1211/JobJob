import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(formData.username, formData.password);

        setIsLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-6 pt-20">
                <div className="w-full max-w-md bg-gradient-to-b from-[#115e59] to-surface p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">

                    <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-4 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Tên Đăng Nhập"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-text-main placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Nhập Mật Khẩu"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-text-main placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row justify-center gap-4 pt-4">
                            <div className="text-center w-full">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-black py-3 rounded-full font-bold hover:bg-primary/90 transition-colors uppercase text-sm tracking-wider shadow-glow mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                                </button>
                                <Link to="/signup" className="block text-sm text-primary hover:underline">
                                    Chưa có tài khoản? Đăng ký ngay
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
