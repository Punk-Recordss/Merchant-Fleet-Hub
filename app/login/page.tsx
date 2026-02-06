"use client";

import { login, signup } from "./actions";
import { useState } from "react";
import { Loader2, Github, Ship, ShieldCheck, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    const handleGithubLogin = async () => {
        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            setMessage({ text: error.message, type: 'error' });
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, action: typeof login | typeof signup) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const result = await action(formData);

        if (result?.error) {
            setMessage({ text: result.error, type: 'error' });
        } else {
            setMessage({ text: "Access granted. Synchronizing Fleet...", type: 'success' });
        }
        setLoading(false);
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a0a0f] overflow-hidden px-4 font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/5 rounded-full blur-[120px]" />
            </div>

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors z-50 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest font-mono">Return to Command</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md glass-card p-10 overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-50" />
                
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-2xl bg-white/5 border border-[var(--neon-cyan)]/20 shadow-[0_0_20px_var(--neon-cyan-glow)]">
                            <Ship className="w-10 h-10 text-[var(--neon-cyan)]" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase mb-2 neon-text">
                        Fleet Access
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm font-mono uppercase tracking-widest">
                        Identity Verification Required
                    </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => handleSubmit(e, login)}>
                    <div className="space-y-2">
                        <label className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Terminal ID (Email)</label>
                        <input 
                            name="email" 
                            type="email" 
                            required 
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--neon-cyan)]/50 transition-all font-mono text-sm"
                            placeholder="navigator@grandline.dev"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Secure Passkey</label>
                        <input 
                            name="password" 
                            type="password" 
                            required 
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-[var(--neon-cyan)]/50 transition-all font-mono text-sm"
                        />
                    </div>

                    {message && (
                        <div className={`flex items-center gap-2 p-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                            message.type === 'error' 
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                            <span>{message.text}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full bg-[var(--neon-cyan)] text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_25px_var(--neon-cyan-glow)] transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? "Establishing Secure Link..." : "Authenticate"}
                        </button>
                    </div>
                </form>

                <div className="relative my-8 hidden">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                        <span className="bg-[#0b0f1a] px-3">External Protocols</span>
                    </div>
                </div>

                <button 
                    className="h-12 w-full glass border border-white/5 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:border-white/20 transition-all flex items-center justify-center gap-3 group hidden"
                    disabled={loading}
                    onClick={handleGithubLogin}
                >
                    <Github className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                    GitHub SSO
                </button>
                
                <div className="mt-8 pt-6 border-t border-white/5 text-[9px] font-mono text-[var(--text-muted)] flex justify-between items-center uppercase tracking-widest">
                    <span>Node: Punk-Records-Main-01</span>
                    <span className="text-emerald-500">Encrypted</span>
                </div>
            </motion.div>
        </div>
    );
}
