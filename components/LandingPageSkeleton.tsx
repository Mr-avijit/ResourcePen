import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../store';

const LandingPageSkeleton: React.FC = () => {
    const { theme } = useTheme();

    // Base colors mapped to the app's theme
    const baseColor = theme === 'dark' ? '#09090b' : '#f1f5f9'; // zinc-950 or slate-100
    const highlightColor = theme === 'dark' ? '#27272a' : '#e2e8f0'; // zinc-800 or slate-200

    // Wrapper to inject theme
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} borderRadius="1rem" duration={1.5}>
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'}`}>
                {children}
            </div>
        </SkeletonTheme>
    );

    return (
        <Wrapper>
            {/* Navbar Skeleton */}
            <div className="w-full h-20 border-b border-slate-200 dark:border-white/10 flex items-center px-6 lg:px-12 justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton circle width={40} height={40} />
                    <Skeleton width={120} height={24} />
                </div>
                <div className="hidden lg:flex gap-8">
                    <Skeleton width={80} height={20} count={5} inline containerClassName='flex gap-8' />
                </div>
                <div className='flex gap-4'>
                    <Skeleton width={40} height={40} circle />
                    <Skeleton width={100} height={40} />
                </div>
            </div>

            {/* Hero Section Skeleton */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-24 overflow-hidden">
                <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-7 flex flex-col items-start space-y-8">
                        <Skeleton width={180} height={32} borderRadius={50} />

                        <div className="space-y-4 w-full">
                            <Skeleton height={80} width="90%" />
                            <Skeleton height={80} width="70%" />
                        </div>

                        <div className="space-y-2 w-full max-w-xl">
                            <Skeleton count={3} />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Skeleton width={180} height={60} borderRadius={16} />
                            <Skeleton width={180} height={60} borderRadius={16} />
                        </div>

                        <div className="pt-8 w-full">
                            <Skeleton width={200} height={16} className='mb-4' />
                            <div className='flex gap-8'>
                                <Skeleton width={100} height={30} />
                                <Skeleton width={100} height={30} />
                                <Skeleton width={100} height={30} />
                            </div>
                        </div>
                    </div>

                    {/* Right Content (Testimonial Card) */}
                    <div className="lg:col-span-5 h-[500px] w-full relative">
                        <Skeleton height="100%" borderRadius={40} />
                    </div>
                </div>
            </section>

            {/* Trust Section Skeleton */}
            <div className="w-full border-y border-slate-100 dark:border-white/5 py-8 bg-slate-50/50 dark:bg-white/5">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center opacity-50">
                    <Skeleton width={120} height={30} />
                    <Skeleton width={120} height={30} />
                    <Skeleton width={120} height={30} />
                    <Skeleton width={120} height={30} />
                    <Skeleton width={120} height={30} className="hidden md:block" />
                </div>
            </div>

            {/* Services Section Skeleton */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 flex flex-col items-center">
                        <Skeleton width={150} height={30} borderRadius={50} className="mb-8" />
                        <Skeleton height={60} width={600} className="mb-6" />
                        <Skeleton count={2} width={400} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex flex-col bg-white dark:bg-zinc-900">
                                <Skeleton width={60} height={60} borderRadius={16} className="mb-8" />
                                <Skeleton width={180} height={32} className="mb-4" />
                                <Skeleton count={3} className="mb-8" />
                                <div className="mt-auto space-y-3">
                                    <Skeleton width={120} height={16} />
                                    <Skeleton width={120} height={16} />
                                    <Skeleton width={120} height={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section Skeleton */}
            <section className="py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <Skeleton width={200} height={40} className="mb-4" />
                            <Skeleton width={300} height={20} />
                        </div>
                        <Skeleton width={100} height={40} borderRadius={12} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col gap-4">
                                <Skeleton height={250} borderRadius={24} />
                                <div className="flex justify-between mt-2">
                                    <Skeleton width={150} height={24} />
                                    <Skeleton width={60} height={24} />
                                </div>
                                <Skeleton count={2} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Wrapper>
    );
};

export default LandingPageSkeleton;
