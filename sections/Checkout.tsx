import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Lock, ArrowRight, User, Mail, Globe, CheckCircle2 } from 'lucide-react';
import { useCart, useNavigation } from '../store';

const Checkout: React.FC = () => {
    const { items, clearCart } = useCart();
    const { navigate } = useNavigation();
    const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal; // Assuming no tax/discount for simplicity in this view

    const handleNext = () => {
        if (step === 'details') setStep('payment');
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 2000));
        setIsProcessing(false);
        setStep('success');
        clearCart();
    };

    if (items.length === 0 && step !== 'success') {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-display font-bold dark:text-white mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('products')} className="text-primary-600 font-bold hover:underline">
                    Return to Marketplace
                </button>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                {/* Left Column: Form Steps */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <h1 className="text-4xl font-display font-black dark:text-white">Checkout</h1>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                            <ShieldCheck size={14} /> Secure Session
                        </div>
                    </div>

                    {step === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[2.5rem] p-12 text-center"
                        >
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">Payment Successful!</h2>
                            <p className="text-emerald-700 dark:text-emerald-300 mb-8 max-w-md mx-auto">
                                Your software license keys have been sent to your email. You can also access them in your dashboard.
                            </p>
                            <button
                                onClick={() => navigate('user-dashboard')}
                                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-emerald-600/30 transition-all hover:-translate-y-1"
                            >
                                Go to Dashboard
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            {/* Step 1: Account Details */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 ${step === 'details' ? 'bg-white dark:bg-zinc-900 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border-slate-100 dark:border-white/5' : 'bg-slate-50 dark:bg-zinc-900/30 border-transparent opacity-60 grayscale'}`}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-black text-slate-500">1</span>
                                        Account Details
                                    </h3>
                                    {step === 'payment' && (
                                        <button onClick={() => setStep('details')} className="text-xs font-bold text-primary-600 uppercase hover:underline">Edit</button>
                                    )}
                                </div>

                                {step === 'details' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input type="email" placeholder="john@example.com" className="w-full bg-slate-50 dark:bg-zinc-800/50 rounded-2xl py-4 pl-12 pr-6 font-medium outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input type="text" placeholder="John Doe" className="w-full bg-slate-50 dark:bg-zinc-800/50 rounded-2xl py-4 pl-12 pr-6 font-medium outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Country / Region</label>
                                            <div className="relative">
                                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <select className="w-full bg-slate-50 dark:bg-zinc-800/50 rounded-2xl py-4 pl-12 pr-6 font-medium outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white appearance-none cursor-pointer">
                                                    <option>United States</option>
                                                    <option>United Kingdom</option>
                                                    <option>Canada</option>
                                                    <option>Germany</option>
                                                    <option>France</option>
                                                    <option>Japan</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg mt-4 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                        >
                                            Continue to Payment <ArrowRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </motion.section>

                            {/* Step 2: Payment */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 ${step === 'payment' ? 'bg-white dark:bg-zinc-900 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border-slate-100 dark:border-white/5' : 'bg-slate-50 dark:bg-zinc-900/30 border-transparent opacity-60 grayscale'}`}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-black text-slate-500">2</span>
                                        Payment Method
                                    </h3>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-10 bg-slate-100 dark:bg-zinc-800 rounded flex items-center justify-center"><CreditCard size={14} className="text-slate-400" /></div>
                                    </div>
                                </div>

                                {step === 'payment' && (
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-zinc-800 dark:to-zinc-900 text-white shadow-xl shadow-slate-900/10 mb-6 relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-8 relative z-10">
                                                <CreditCard className="text-slate-400" />
                                                <span className="font-mono text-slate-400">CREDIT</span>
                                            </div>
                                            <div className="font-mono text-xl tracking-widest mb-6 relative z-10">
                                                •••• •••• •••• ••••
                                            </div>
                                            <div className="flex justify-between items-end relative z-10">
                                                <div className="text-xs text-slate-400">
                                                    <div className="mb-1 uppercase tracking-wider">Card Holder</div>
                                                    <div className="font-bold text-white text-sm">YOUR NAME</div>
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    <div className="mb-1 uppercase tracking-wider">Expires</div>
                                                    <div className="font-bold text-white text-sm">MM/YY</div>
                                                </div>
                                            </div>

                                            {/* Background decoration */}
                                            <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Card Number</label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 dark:bg-zinc-800/50 rounded-2xl py-4 pl-12 pr-6 font-mono font-medium outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Expiry Date</label>
                                                    <input type="text" placeholder="MM / YY" className="w-full bg-slate-50 dark:bg-zinc-800/50 rounded-2xl py-4 px-6 font-medium outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-center" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">CVC</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                        <input type="text" placeholder="123" className="w-full bg-slate-50 dark:bg-zinc-800/50 rounded-2xl py-4 pl-12 pr-6 font-medium outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full py-5 bg-primary-600 text-white rounded-2xl font-bold text-lg mt-4 shadow-xl shadow-primary-600/30 hover:shadow-primary-600/50 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                                        >
                                            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                                            {!isProcessing && <Lock size={18} />}
                                        </button>

                                        <p className="text-center text-xs text-slate-400 font-medium">
                                            Payments are secure and encrypted.
                                        </p>
                                    </div>
                                )}
                            </motion.section>
                        </>
                    )}
                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32">
                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-2xl shadow-slate-200/20 dark:shadow-black/20">
                            <h3 className="text-xl font-bold dark:text-white mb-8">Order Summary</h3>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-start">
                                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-zinc-900 overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm dark:text-white mb-1 line-clamp-2">{item.name}</h4>
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.category}</div>
                                        </div>
                                        <div className="font-bold text-sm dark:text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 py-6 border-t border-slate-100 dark:border-zinc-900">
                                <div className="flex justify-between text-sm text-slate-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500 font-medium">
                                    <span>Tax (0%)</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-4 mt-2 border-t border-slate-100 dark:border-zinc-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
                                By completing your purchase, you agree to our Terms of Service and Refund Policy.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
