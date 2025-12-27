import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PricingCard = ({ title, price, features, isAuthenticated, highlight = false }) => (
    <div className={`p-8 rounded-2xl flex flex-col relative h-full ${
        highlight
            ? 'bg-primary text-black transform md:-translate-y-6 shadow-2xl border-2 border-white/20'
            : 'bg-white text-black'
    }`}>
        <h3 className={`text-xl font-bold uppercase tracking-wider mb-2 ${highlight ? 'text-background' : ''}`}>
            {title}
        </h3>
        <div className="text-3xl font-black mb-1">{price}</div>
        <div className={`text-sm font-medium mb-6 ${highlight ? 'text-black/70' : 'text-gray-600'}`}>
            trong 1 tháng
        </div>

        <div className={`font-bold mb-4 ${highlight ? 'text-background' : ''}`}>Features</div>
        <ul className="space-y-3 flex-1 mb-8">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                    <div className="min-w-4 pt-1">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        {isAuthenticated ? (
            <Link
                to="/dashboard"
                className="bg-black text-white py-4 rounded-full font-bold text-center hover:bg-gray-800 transition-colors uppercase text-sm tracking-widest"
            >
                VÀO DASHBOARD
            </Link>
        ) : (
            <Link
                to="/signup?role=employer"
                className="bg-black text-white py-4 rounded-full font-bold text-center hover:bg-gray-800 transition-colors uppercase text-sm tracking-widest"
            >
                ĐĂNG KÝ NGAY
            </Link>
        )}
    </div>
);

const EmployerPricingPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-background text-white">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
                <h2 className="text-3xl font-light mb-4 text-center">Các Hạn Mức Đăng Ký</h2>
                <p className="text-text-muted mb-12 text-center">Dành cho Nhà Tuyển Dụng</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                    <PricingCard
                        title="JOBJOB ECO"
                        price="2.000.000 VND"
                        features={["Đăng 3 tin tuyển dụng"]}
                        isAuthenticated={isAuthenticated}
                    />

                    <PricingCard
                        title="JOBJOB MAX"
                        price="15.000.000 VND"
                        features={[
                            "Đăng tin không giới hạn",
                            "Ưu tiên hiển thị mọi lúc",
                            "Thuật toán tối ưu",
                            "Truy cập kho CV đã được tối ưu"
                        ]}
                        isAuthenticated={isAuthenticated}
                        highlight
                    />

                    <PricingCard
                        title="JOBJOB PLUS"
                        price="5.000.000 VND"
                        features={[
                            "Đăng 8 tin tuyển dụng",
                            "Hiển thị giờ vàng"
                        ]}
                        isAuthenticated={isAuthenticated}
                    />
                </div>

                <div className="mt-12 text-center">
                    <Link to="/pricing/candidate" className="text-primary hover:underline">
                        Xem gói cước cho Ứng viên
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployerPricingPage;
