import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-white hover:text-[#00E5FF] transition-colors">JobJob</Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                    <a href="#" className="hover:text-[#00E5FF] transition-colors">Giới thiệu</a>
                    <a href="#" className="hover:text-[#00E5FF] transition-colors">Liên Hệ</a>
                    <a href="#" className="hover:text-[#00E5FF] transition-colors">Gói Cước</a>
                    <Link to="/signup" className="hover:text-[#00E5FF] transition-colors">Đăng Ký</Link>
                    <Link to="/login" className="bg-[#00E5FF] text-black px-4 py-2 rounded font-bold hover:bg-[#00E5FF]/90 transition-all">Đăng Nhập</Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Links */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0B0F19] border-b border-white/5 px-6 py-4 space-y-4">
                    <a href="#" className="block text-gray-300 hover:text-[#00E5FF]">Giới thiệu</a>
                    <a href="#" className="block text-gray-300 hover:text-[#00E5FF]">Liên Hệ</a>
                    <a href="#" className="block text-gray-300 hover:text-[#00E5FF]">Gói Cước</a>
                    <Link to="/signup" className="block text-gray-300 hover:text-[#00E5FF]">Đăng Ký</Link>
                    <Link to="/login" className="block text-[#00E5FF] font-bold">Đăng Nhập</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
