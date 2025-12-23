import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const CandidatePricingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-white">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
                <h2 className="text-3xl font-light mb-16 text-center">Các Hạn Mức Đăng Ký</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

                    {/* FREE */}
                    <div className="bg-white text-black p-10 rounded-2xl flex flex-col relative h-full">
                        <h3 className="text-2xl font-bold uppercase tracking-wider mb-2">JOBJOB FREE</h3>
                        <div className="text-4xl font-black mb-1">0 VND</div>
                        <div className="text-sm font-medium text-gray-600 mb-8">trong 1 tháng</div>

                        <div className="text-xl font-bold mb-6">Features</div>
                        <ul className="space-y-4 flex-1 mb-10 text-lg">
                            <li className="flex items-start gap-3">
                                <div className="min-w-4 pt-2"><div className="w-3 h-3 bg-black rounded-full"></div></div>
                                <span>12 lượt lướt phải mỗi ngày</span>
                            </li>
                        </ul>

                        <Link to="/login" className="bg-black text-white py-5 rounded-full font-bold text-center hover:bg-gray-800 transition-colors uppercase tracking-widest text-lg">
                            SUBSCRIBE
                        </Link>
                    </div>

                    {/* GOLD */}
                    <div className="bg-primary text-black p-10 rounded-2xl flex flex-col relative h-full shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                        <h3 className="text-2xl font-bold uppercase tracking-wider mb-2 text-background">JOBJOB GOLD</h3>
                        <div className="text-4xl font-black mb-1">120.000 VND</div>
                        <div className="text-sm font-medium text-black/70 mb-8">trong 1 tháng</div>

                        <div className="text-xl font-bold mb-6 text-background">Features</div>
                        <ul className="space-y-4 flex-1 mb-10 text-lg">
                            <li className="flex items-start gap-3">
                                <div className="min-w-4 pt-2"><div className="w-3 h-3 bg-black rounded-full"></div></div>
                                <span>Không giới hạn lượt lướt phải</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="min-w-4 pt-2"><div className="w-3 h-3 bg-black rounded-full"></div></div>
                                <span>Ưu tiên hiển thị mọi lúc</span>
                            </li>
                        </ul>

                        <Link to="/login" className="bg-black text-white py-5 rounded-full font-bold text-center hover:bg-gray-900 transition-colors uppercase tracking-widest text-lg">
                            SUBSCRIBE
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CandidatePricingPage;
