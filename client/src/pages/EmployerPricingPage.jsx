import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const PricingCard = ({ title, price, features, recommended = false }) => (
    <div className={`bg-white text-black p-8 rounded-2xl flex flex-col relative ${recommended ? 'transform md:-translate-y-4 shadow-[0_0_50px_rgba(0,229,255,0.3)] z-10' : ''} h-full`}>
        {recommended && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Recommended
            </div>
        )}
        <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{title}</h3>
        <div className="text-3xl font-black mb-1">{price}</div>
        <div className="text-sm font-medium text-gray-600 mb-6">trong 1 tháng</div>

        <div className="font-bold mb-4">Features</div>
        <ul className="space-y-3 flex-1 mb-8">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="min-w-4 pt-1"><div className="w-2 h-2 bg-black rounded-full text-black"></div></div>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <Link to="/login" className="bg-black text-white py-4 rounded-full font-bold text-center hover:bg-gray-800 transition-colors uppercase text-sm tracking-widest">
            SUBSCRIBE
        </Link>
    </div>
);

const EmployerPricingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-white">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
                <h2 className="text-3xl font-light mb-16 text-center">Các Hạn Mức Đăng Ký</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                    {/* ECO */}
                    <PricingCard
                        title="JOBJOB ECO"
                        price="2.000.000 VND"
                        features={[
                            "Đăng 3 tin tuyển dụng"
                        ]}
                    />

                    {/* MAX */}
                    <div className="relative">
                        {/* Custom Card for MAX to match visual exactly with blue background */}
                        <div className="bg-primary text-black p-8 rounded-2xl flex flex-col relative transform md:-translate-y-6 shadow-2xl h-full border-2 border-white/20">
                            <h3 className="text-xl font-bold uppercase tracking-wider mb-2 text-background">JOBJOB MAX</h3>
                            <div className="text-3xl font-black mb-1">15.000.000 VND</div>
                            <div className="text-sm font-medium text-black/70 mb-6">trong 1 tháng</div>

                            <div className="font-bold mb-4 text-background">Features</div>
                            <ul className="space-y-3 flex-1 mb-8">
                                <li className="flex items-start gap-2 text-sm font-medium">
                                    <div className="min-w-4 pt-1"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                                    <span>Đăng tin không giới hạn</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm font-medium">
                                    <div className="min-w-4 pt-1"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                                    <span>Ưu tiên hiển thị mọi lúc</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm font-medium">
                                    <div className="min-w-4 pt-1"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                                    <span>Thuật toán tối ưu</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm font-medium">
                                    <div className="min-w-4 pt-1"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                                    <span>Truy cập kho CV đã được tối ưu</span>
                                </li>
                            </ul>

                            <Link to="/login" className="bg-black text-white py-4 rounded-full font-bold text-center hover:bg-gray-900 transition-colors uppercase text-sm tracking-widest">
                                SUBSCRIBE
                            </Link>
                        </div>
                    </div>

                    {/* PLUS */}
                    <PricingCard
                        title="JOBJOB PLUS"
                        price="5.000.000 VND"
                        features={[
                            "Đăng 8 tin tuyển dụng",
                            "Hiển thị giờ vàng"
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployerPricingPage;
