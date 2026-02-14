import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
   const navigate = useNavigate();
   const { login } = useAuth();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setError('');
      setIsSubmitting(true);

      try {
         await login({ email, password });
         navigate('/', { replace: true });
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unable to login');
      } finally {
         setIsSubmitting(false);
      }
   };

   // console.log('API_BASE', import.meta.env.VITE_API_BASE_URL);

   return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
         <div className="pointer-events-none absolute -top-20 left-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl animate-pulse" />
         <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

         <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
            <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
               <div className="grid gap-10 lg:grid-cols-2">
                  <div className="flex flex-col justify-center gap-6">
                     <div className="space-y-3">
                        <p className="text-sm uppercase tracking-[0.2em] text-blue-200">
                           Home Care
                        </p>

                        <h1 className="text-4xl font-semibold leading-tight">
                           Welcome back
                        </h1>

                        <p className="text-sm text-slate-200">
                           Sign in to manage family health records, track
                           metrics, and stay on the top of daily care.
                        </p>
                     </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-xl">
                     <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Sign in</h2>
                        <p className="text-sm text-slate-200">
                           Enter your details to continue.
                        </p>
                     </div>

                     <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <label className="grid gap-2 text-sm font-medium text-slate-200">
                           Email Address:
                           <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-blue-400 focus:outline-none"
                           />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-slate-200">
                           Password:
                           <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-blue-400 focus:outline-none"
                           />
                        </label>

                        {/* <div className="flex items-center justify-between text-xs text-slate-300">
                           <label className="flex items-center gap-2">
                              <input
                                 type="checkbox"
                                 className="h-4 w-4 rounded border-white/30 bg-white/10"
                              />
                              Remember Me
                           </label>
                           <button
                              type="button"
                              className="text-blue-200 hover:text-blue-100 cursor-pointer"
                           >
                              Forgot password?
                           </button>
                        </div> */}

                        {error && (
                           <p className="text-sm text-rose-200">{error}</p>
                        )}

                        <button
                           type="submit"
                           disabled={isSubmitting}
                           className="mt-2 w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400 disabled:opacity-60 cursor-pointer"
                        >
                           {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                     </form>

                     <p className="mt-6 text-center text-sm text-slate-300">
                        New here?{' '}
                        <Link
                           to={'/signup'}
                           className="font-semibold text-blue-200 hover:text-blue-100"
                        >
                           Create an account
                        </Link>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
