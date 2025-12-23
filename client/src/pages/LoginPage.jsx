import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-6 pt-20">
                <div className="w-full max-w-md bg-gradient-to-b from-[#115e59] to-surface p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">

                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Tên Đăng Nhập"
                                    className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-text-main placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Nhập Mật Khẩu"
                                    className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-text-main placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row justify-center gap-4 pt-4">
                            <div className="text-center w-full">
                                <button type="submit" className="w-full bg-primary text-black py-3 rounded-full font-bold hover:bg-primary/90 transition-colors uppercase text-sm tracking-wider shadow-glow mb-4">
                                    Đăng Nhập
                                </button>
                                <Link to="/selection" className="block text-sm text-primary hover:underline">
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
