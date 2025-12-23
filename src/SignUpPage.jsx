import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-6 pt-20">
                <div className="w-full max-w-md bg-gradient-to-b from-[#115e59] to-[#0f172a] p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">

                    <h2 className="text-2xl font-bold text-center mb-8 tracking-wider">Tạo Tài Khoản</h2>

                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Tên Hiển Thị"
                                    className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-white placeholder-gray-400 focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Tên Đăng Nhập"
                                    className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-white placeholder-gray-400 focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Nhập Mật Khẩu"
                                    className="w-full bg-black/40 border border-white/10 rounded-full py-4 px-6 text-center text-white placeholder-gray-400 focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row justify-center gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-[#00E5FF] text-black py-3 rounded-full font-bold hover:bg-[#00E5FF]/90 transition-colors uppercase text-sm tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                                Đăng Ký
                            </button>
                            <Link to="/login" className="flex-1 border border-white/30 text-white py-3 rounded-full font-bold text-center hover:bg-white/5 transition-colors uppercase text-sm tracking-wider">
                                Đăng Nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
