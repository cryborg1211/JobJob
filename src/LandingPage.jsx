import React from 'react';
import Navbar from './Navbar';
import { Rocket, FileText, Bell, Check, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0B0F19] to-[#020617] text-white font-sans selection:bg-[#00E5FF] selection:text-black overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <div className="flex-1 space-y-8 z-10">
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
                        Lướt Để Tìm Việc, <br />
                        <span className="text-[#00E5FF]">Match</span> Để Thành Công
                    </h1>
                    <p className="text-lg text-gray-400 max-w-xl">
                        Lướt trái bỏ qua, quẹt phải là có việc – Jobjob, nơi cơ hội tìm đến bạn chỉ sau một cú click.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-[#00E5FF] text-black font-bold px-8 py-3 rounded hover:bg-[#00E5FF]/90 transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                            SUBSCRIBE
                        </button>
                        <button className="border border-white/20 text-white font-bold px-8 py-3 rounded hover:bg-white/5 transition-colors">
                            FREE TRIAL
                        </button>
                    </div>
                </div>

                {/* Hero 3D Placeholder */}
                <div className="flex-1 w-full flex justify-center lg:justify-end z-10">
                    <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-gray-800 to-black/50 border border-white/10 flex items-center justify-center group overflow-hidden">
                        <div className="absolute inset-0 bg-[#00E5FF]/5 blur-3xl group-hover:bg-[#00E5FF]/10 transition-all duration-700"></div>
                        <div className="text-center p-8">
                            <Rocket className="w-24 h-24 text-[#00E5FF] mx-auto mb-4 animate-bounce" />
                            <p className="text-gray-500 font-mono text-sm">[3D COMPUTER ILLUSTRATION]</p>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
                        <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-10 border-y border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">Featured on</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-xl lg:text-2xl font-bold font-serif">TechCrunch</span>
                        <span className="text-xl lg:text-2xl font-bold tracking-[0.2em]">FASTCOMPANY</span>
                        <span className="text-xl lg:text-2xl font-black">MIT</span>
                        <span className="text-xl lg:text-2xl font-serif italic">Forbes</span>
                    </div>
                </div>
            </section>

            {/* Feature 1 (Zig-Zag) */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 w-full order-2 lg:order-1">
                        {/* Feature 1 Placeholder */}
                        <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-tr from-gray-900 to-gray-800 border border-white/5 flex items-center justify-center overflow-hidden hover:border-[#00E5FF]/30 transition-colors duration-500">
                            <FileText className="w-20 h-20 text-gray-600" />
                            <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                <div className="h-2 w-1/3 bg-[#00E5FF] rounded-full mb-2"></div>
                                <div className="h-2 w-1/2 bg-gray-700 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 order-1 lg:order-2">
                        <div className="text-[#00E5FF] text-sm font-bold tracking-wider uppercase">Thuật toán thông minh</div>
                        <h2 className="text-4xl font-bold leading-tight">Kết Nối Các Hồ Sơ Làm Việc Phù Hợp Với Mô Tả</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Áp dụng thuật toán matching vào quá trình recommend việc làm phù hợp với hồ sơ người dùng, giúp tiết kiệm 90% thời gian tìm kiếm.
                        </p>
                        <button className="bg-[#00E5FF] text-black px-6 py-2 rounded-full font-bold hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
                            SUBSCRIBE
                        </button>
                    </div>
                </div>
            </section>

            {/* Feature 2 (Zig-Zag) */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="text-[#00E5FF] text-sm font-bold tracking-wider uppercase">Tối ưu hoá quá trình tuyển dụng</div>
                        <h2 className="text-4xl font-bold leading-tight">Loại Bỏ Quá Trình Sàn Lọc Bằng Tay Cho Nhà Tuyển Dụng</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Hệ thống tự động phân loại và đánh giá ứng viên. Tiết kiệm thời gian quý báu trong quy trình sàn lọc CV.
                        </p>
                        <ul className="space-y-3 pt-2">
                            {[1, 2, 3].map(i => (
                                <li key={i} className="flex items-center gap-3 text-gray-400">
                                    <div className="w-5 h-5 rounded-full bg-[#00E5FF]/20 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-[#00E5FF]" />
                                    </div>
                                    <span>Lợi ích tự động hoá số {i}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#00E5FF] text-black px-6 py-2 rounded-full font-bold hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all mt-4">
                            SUBSCRIBE
                        </button>
                    </div>
                    <div className="flex-1 w-full">
                        {/* Feature 2 Placeholder */}
                        <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-bl from-gray-900 to-gray-800 border border-white/5 flex items-center justify-center overflow-hidden hover:border-[#00E5FF]/30 transition-colors duration-500">
                            <Bell className="w-20 h-20 text-[#00E5FF]" />
                            {/* Floating notifications */}
                            <div className="absolute top-1/4 right-10 bg-[#0B0F19] p-3 rounded-lg border border-white/10 shadow-xl flex items-center gap-3 animate-pulse">
                                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="text-xs">
                                    <div className="text-white font-bold">New Match!</div>
                                    <div className="text-gray-500">Just now</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF] to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gradient-to-r from-cyan-900/40 to-blue-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 lg:p-20 text-center overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Rocket className="w-40 h-40 transform rotate-45" />
                        </div>

                        <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
                            Tuyển Dụng Thời Đại Mới, <br /> Bắt Đầu Từ Bạn
                        </h2>
                        <p className="text-[#00E5FF] font-bold tracking-widest mb-10 text-lg uppercase">
                            BẠN ĐÃ SẴN SÀNG CHƯA?
                        </p>
                        <button className="bg-black text-white hover:bg-gray-900 border border-gray-800 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transition-all hover:scale-105">
                            Xem các gói Thành viên <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-black/40 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">JobJob</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Nền tảng tuyển dụng thông minh hàng đầu, kết nối nhân tài với doanh nghiệp một cách nhanh chóng và hiệu quả.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-6">Liên Hệ</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>info@jobjob.vn</li>
                            <li>+84 123 456 789</li>
                            <li>Hồ Chí Minh, Việt Nam</li>
                        </ul>
                    </div>

                    {/* Links (Dummy) */}
                    <div>
                        <h4 className="font-bold mb-6">Khám Phá</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-[#00E5FF]">Về chúng tôi</a></li>
                            <li><a href="#" className="hover:text-[#00E5FF]">Blog tuyển dụng</a></li>
                            <li><a href="#" className="hover:text-[#00E5FF]">Chính sách bảo mật</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold mb-6">Newsletter</h4>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email của bạn" className="bg-white/5 border border-white/10 rounded px-4 py-2 w-full focus:outline-none focus:border-[#00E5FF] text-sm" />
                            <button className="bg-[#00E5FF] text-black px-4 rounded font-bold hover:bg-[#00E5FF]/90">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-4">Đăng ký để nhận tin tức mới nhất.</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
                    &copy; 2024 JobJob. All rights reserved.
                </div>
            </footer>
        </div >
    );
};

export default LandingPage;
