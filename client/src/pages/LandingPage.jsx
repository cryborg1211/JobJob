import React from 'react';
import Navbar from '../components/Navbar';
import { Rocket, FileText, Bell, Check, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#020617] text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <div className="flex-1 space-y-8 z-10">
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                        Lướt Để Tìm Việc, <br />
                        <span className="text-primary text-glow">Match</span> Để Thành Công
                    </h1>
                    <p className="text-lg text-text-muted max-w-xl">
                        Lướt trái bỏ qua, quẹt phải là có việc – Jobjob, nơi cơ hội tìm đến bạn chỉ sau một cú click.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-primary text-black font-bold px-8 py-3 rounded hover:bg-primary/90 transition-transform active:scale-95 shadow-glow">
                            SUBSCRIBE
                        </button>
                        <button className="border border-white/20 text-text-main font-bold px-8 py-3 rounded hover:bg-white/5 transition-colors">
                            FREE TRIAL
                        </button>
                    </div>
                </div>

                {/* Hero 3D Placeholder */}
                <div className="flex-1 w-full flex justify-center lg:justify-end z-10">
                    <div className="relative w-full max-w-md aspect-square rounded-3xl bg-surface/50 backdrop-blur-md border border-white/5 flex items-center justify-center group overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
                        <div className="text-center p-8">
                            <Rocket className="w-24 h-24 text-primary mx-auto mb-4 animate-bounce" />
                            <p className="text-text-muted font-mono text-sm">[3D COMPUTER ILLUSTRATION]</p>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl"></div>
                        <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
