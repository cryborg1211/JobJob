import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const [searchParams] = useSearchParams();
    const roleFromUrl = searchParams.get('role');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: roleFromUrl || 'candidate'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth();
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

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);

        const result = await signup({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role
        });

        setIsLoading(false);

        if (result.success) {
            // Navigate based on role
            if (formData.role === 'employer') {
                navigate('/pricing/employer');
            } else {
                navigate('/pricing/candidate');
            }
        } else {
            setError(result.error || 'Đăng ký thất bại');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-10">
                <div className="w-full max-w-md bg-gradient-to-b from-[#115e59] to-surface p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">

                    <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký Tài Khoản</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-4 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div className="flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'candidate' })}
                                className={`flex-1 py-3 rounded-full font-medium transition-all ${
                                    formData.role === 'candidate'
                                        ? 'bg-primary text-black'
                                        : 'bg-black/40 border border-white/10 text-text-muted hover:border-primary/50'
                                }`}
                            >
                                Ứng Viên
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'employer' })}
                                className={`flex-1 py-3 rounded-full font-medium transition-all ${
                                    formData.role === 'employer'
                                        ? 'bg-primary text-black'
                                        : 'bg-black/40 border border-white/10 text-text-muted hover:border-primary/50'
                                }`}
                            >
                                Nhà Tuyển Dụng
                            </button>
                        </div>

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
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
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
                                placeholder="Mật Khẩu"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-text-main placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Xác Nhận Mật Khẩu"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-text-main placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-black py-3 rounded-full font-bold hover:bg-primary/90 transition-colors uppercase text-sm tracking-wider shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-primary hover:underline">
                                Đã có tài khoản? Đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
