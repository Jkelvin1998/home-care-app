import { Link } from 'react-router-dom';

export default function Signup() {
   return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
         <div className="pointer-events-none absolute -top-20 left-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
         <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-500/30 blur-3xl animate-pulse" />

         <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
            <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
               <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-8">
                     <h1 className="text-3xl font-semibold">Create your account</h1>
                     <p className="mt-2 text-sm text-slate-200">
                        Build a secure home-care workspace for your entire family.
                     </p>
                     <div className="mt-6 space-y-4 text-sm text-slate-200">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                           <p className="font-semibold text-white">Personalized profiles</p>
                           <p className="mt-1">Store age-aware health metrics with ease.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                           <p className="font-semibold text-white">Daily tracking</p>
                           <p className="mt-1">Log temperature, oxygen, pulse rate, and symptoms.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                           <p className="font-semibold text-white">Smart insights</p>
                           <p className="mt-1">Keep a quick view of what’s normal for each age group.</p>
                        </div>
                     </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-xl">
                     <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Sign up</h2>
                        <p className="text-sm text-slate-200">Start tracking in minutes.</p>
                     </div>
                     <form className="mt-6 space-y-4">
                        <label className="grid gap-2 text-sm font-medium text-slate-200">
                           Full name
                           <input
                              type="text"
                              placeholder="Alex Johnson"
                              className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-emerald-400 focus:outline-none"
                           />
                        </label>
                        <label className="grid gap-2 text-sm font-medium text-slate-200">
                           Email address
                           <input
                              type="email"
                              placeholder="you@example.com"
                              className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-emerald-400 focus:outline-none"
                           />
                        </label>
                        <label className="grid gap-2 text-sm font-medium text-slate-200">
                           Create password
                           <input
                              type="password"
                              placeholder="Minimum 8 characters"
                              className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-emerald-400 focus:outline-none"
                           />
                        </label>
                        <label className="grid gap-2 text-sm font-medium text-slate-200">
                           Confirm password
                           <input
                              type="password"
                              placeholder="Re-enter password"
                              className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-emerald-400 focus:outline-none"
                           />
                        </label>
                        <button
                           type="submit"
                           className="mt-2 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
                        >
                           Create account
                        </button>
                     </form>
                     <p className="mt-6 text-center text-sm text-slate-300">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-emerald-200 hover:text-emerald-100">
                           Sign in
                        </Link>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
