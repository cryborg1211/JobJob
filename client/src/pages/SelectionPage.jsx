import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const SelectionPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-white">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <h2 className="text-2xl lg:text-3xl font-light mb-8 font-sans tracking-wide text-gray-300">Các Hạn Mức Đăng Ký</h2>
                <h1 className="text-5xl lg:text-7xl font-bold mb-20 tracking-tight">Bạn Là Ai ?</h1>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-32 w-full max-w-4xl justify-center">
                    <Link to="/pricing/employer" className="flex-1 py-12 rounded-full bg-primary hover:bg-primary/90 text-background text-xl lg:text-2xl font-bold tracking-widest transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center">
                        NHÀ TUYỂN DỤNG
                    </Link>

                    <Link to="/pricing/candidate" className="flex-1 py-12 rounded-full bg-primary hover:bg-primary/90 text-background text-xl lg:text-2xl font-bold tracking-widest transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center">
                        ỨNG VIÊN
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SelectionPage;
