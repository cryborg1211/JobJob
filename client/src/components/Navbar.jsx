import React, { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, Heart, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link
                    to={isAuthenticated ? "/dashboard" : "/"}
                    className="text-2xl font-bold tracking-tighter text-white hover:text-primary transition-colors"
                >
                    JobJob
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={`flex items-center gap-2 hover:text-primary transition-colors ${isActive('/dashboard') ? 'text-primary' : ''}`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link
                                to="/swipe"
                                className={`hover:text-primary transition-colors ${isActive('/swipe') ? 'text-primary' : ''}`}
                            >
                                {user?.role === 'employer' ? 'Tìm Ứng Viên' : 'Tìm Việc'}
                            </Link>
                            <Link
                                to="/matches"
                                className={`flex items-center gap-2 hover:text-primary transition-colors ${isActive('/matches') ? 'text-primary' : ''}`}
                            >
                                <Heart className="w-4 h-4" />
                                Matches
                            </Link>
                            <Link
                                to="/profile"
                                className={`flex items-center gap-2 hover:text-primary transition-colors ${isActive('/profile') ? 'text-primary' : ''}`}
                            >
                                <User className="w-4 h-4" />
                                Hồ Sơ
                            </Link>

                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <span className="text-primary font-medium">{user?.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg font-medium hover:bg-white/20 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/selection" className="hover:text-primary transition-colors">Gói Cước</Link>
                            <Link
                                to="/login"
                                className="bg-primary text-black px-5 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-glow"
                            >
                                Đăng Nhập
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-surface border-b border-white/5 px-6 py-4 space-y-3">
                    {isAuthenticated ? (
                        <>
                            <div className="pb-3 mb-3 border-b border-white/10">
                                <span className="text-primary font-medium">{user?.username}</span>
                                <span className="text-text-muted text-sm ml-2">
                                    ({user?.role === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'})
                                </span>
                            </div>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-3 py-2 text-gray-300 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard
                            </Link>
                            <Link
                                to="/swipe"
                                className="flex items-center gap-3 py-2 text-gray-300 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {user?.role === 'employer' ? 'Tìm Ứng Viên' : 'Tìm Việc'}
                            </Link>
                            <Link
                                to="/matches"
                                className="flex items-center gap-3 py-2 text-gray-300 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Heart className="w-5 h-5" />
                                Matches
                            </Link>
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 py-2 text-gray-300 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User className="w-5 h-5" />
                                Hồ Sơ
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 py-2 text-red-400 hover:text-red-300 w-full"
                            >
                                <LogOut className="w-5 h-5" />
                                Đăng Xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/selection"
                                className="block py-2 text-gray-300 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Gói Cước
                            </Link>
                            <Link
                                to="/login"
                                className="block py-2 text-primary font-bold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Đăng Nhập
                            </Link>
                            <Link
                                to="/signup"
                                className="block py-2 text-gray-300 hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Đăng Ký
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
