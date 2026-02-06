"use client";

import { motion } from 'framer-motion'
import { Compass, Database, ExternalLink, Ship, Lock, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const projects = [
  {
    name: 'Log Pose',
    description: 'Autonomous Portfolio Navigator. Tracking your journey across the Grand Line of crypto.',
    href: 'https://logpose.punkrecords.dev',
    icon: Compass,
    color: '--neon-cyan',
    status: 'Operational'
  },
  {
    name: 'Poneglyph',
    description: 'Indestructible Mission Control. Documenting our collaboration and collective knowledge.',
    href: 'https://mission.punkrecords.dev',
    icon: Database,
    color: '--neon-purple',
    status: 'Active'
  }
]

export default function FleetHub() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_var(--neon-cyan-glow)]" />
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />

      {/* User Status Bar */}
      <div className="absolute top-8 right-8 z-50">
        {user ? (
          <div className="flex items-center gap-4 glass px-4 py-2 rounded-xl">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Authenticated</span>
              <span className="text-xs text-white font-mono">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="flex items-center gap-2 glass px-6 py-2 rounded-xl hover:border-[var(--neon-cyan)] transition-all group"
          >
            <Lock className="w-4 h-4 text-[var(--neon-cyan)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-[var(--neon-cyan)] transition-colors">
              Identity Verification
            </span>
          </Link>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-16"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <Ship className="w-12 h-12 text-[var(--neon-cyan)] drop-shadow-[0_0_10px_var(--neon-cyan-glow)]" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter neon-text uppercase">
            Punk Records
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] font-mono tracking-[0.3em] uppercase text-sm md:text-base">
          Merchant Fleet Command Center
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full z-10">
        {projects.map((project, idx) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * (idx + 1) }}
          >
            {user ? (
              <a 
                href={project.href}
                className="glass-card p-8 block group relative h-full flex flex-col"
                style={{ '--border-glow': `var(${project.color}-glow)` } as any}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                    <project.icon 
                      className="w-8 h-8" 
                      style={{ color: `var(${project.color})` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] group-hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {project.status}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[var(--neon-cyan)] transition-colors uppercase tracking-tight">
                  {project.name}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 flex-1">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold text-[var(--neon-cyan)] uppercase tracking-widest">
                  Initiate Link
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </a>
            ) : (
              <div className="glass-card p-8 group relative h-full flex flex-col opacity-60 grayscale cursor-not-allowed">
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-2 bg-[#0a0a0f]/80 backdrop-blur-sm p-4 rounded-xl border border-rose-500/20">
                      <ShieldAlert className="w-6 h-6 text-rose-500" />
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">Authentication Required</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <project.icon className="w-8 h-8 text-white/20" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white/40 mb-3 uppercase tracking-tight">
                  {project.name}
                </h2>
                <p className="text-white/20 text-sm leading-relaxed mb-8 flex-1">
                  {project.description}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-24 text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-[0.5em] z-10"
      >
        Verified by Vegapunk-01 • Protocol V1
      </motion.footer>
    </main>
  )
}
