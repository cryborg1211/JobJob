import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, Heart, User, Plus, Search } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();
    const isEmployer = user?.role === 'employer';

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Xin chào, {user?.username}!
                    </h1>
                    <p className="text-text-muted">
                        {isEmployer
                            ? 'Tìm ứng viên phù hợp cho công ty của bạn'
                            : 'Tìm công việc mơ ước của bạn'
                        }
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {isEmployer ? (
                        <>
                            <Link to="/swipe" className="group bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Tìm Ứng Viên</h3>
                                <p className="text-text-muted text-sm">Lướt và tìm ứng viên phù hợp</p>
                            </Link>

                            <Link to="/jobs/manage" className="group bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Quản Lý Việc Làm</h3>
                                <p className="text-text-muted text-sm">Xem và quản lý tin tuyển dụng</p>
                            </Link>

                            <Link to="/jobs/create" className="group bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                    <Plus className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Đăng Tin Mới</h3>
                                <p className="text-text-muted text-sm">Tạo tin tuyển dụng mới</p>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/swipe" className="group bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                    <Search className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Tìm Việc</h3>
                                <p className="text-text-muted text-sm">Lướt và tìm công việc phù hợp</p>
                            </Link>

                            <Link to="/matches" className="group bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Matches</h3>
                                <p className="text-text-muted text-sm">Xem các kết nối thành công</p>
                            </Link>

                            <Link to="/profile" className="group bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Hồ Sơ</h3>
                                <p className="text-text-muted text-sm">Cập nhật thông tin cá nhân</p>
                            </Link>
                        </>
                    )}
                </div>

                {/* Common Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/matches" className="group bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Xem Matches</h3>
                                <p className="text-text-muted text-sm">Kết nối với {isEmployer ? 'ứng viên' : 'nhà tuyển dụng'}</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/profile" className="group bg-gradient-to-r from-secondary/20 to-primary/20 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Cập Nhật Hồ Sơ</h3>
                                <p className="text-text-muted text-sm">Hoàn thiện thông tin của bạn</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
