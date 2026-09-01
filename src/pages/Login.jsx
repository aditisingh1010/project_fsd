import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex flex-col px-container-margin py-stack-sm bg-background border-b-2 border-primary">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto h-12">
          <Link
            className="flex items-center gap-1 text-primary font-label-sm text-label-sm uppercase tracking-widest font-bold"
            to="/"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
            Back
          </Link>
          <div className="flex-grow text-center">
            <h1 className="font-headline-lg-mobile text-[24px] md:text-[32px] tracking-tighter font-black text-primary uppercase">
              CAMPU S SCOUT
            </h1>
          </div>
          <div className="w-[64px]"></div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-container-margin flex items-center justify-center">
        <div className="w-full max-w-md py-section-gap">
          <div className="flex flex-col items-start gap-stack-sm mb-stack-lg relative">
            <div className="sticker-badge static inline-block rotate-[-4deg] mb-2">Members Only</div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">Welcome back</span>
            <h2 className="font-headline-xl text-headline-xl text-primary leading-tight">
              Sign in and skip the broker jargon.
            </h2>
            <p className="font-body-md text-body-md text-primary font-medium">
              Your saved PGs, verdicts and scam reports are waiting exactly where you left them.
            </p>
          </div>

          <div className="bg-surface editorial-border p-stack-lg shadow-brutal transform rotate-1">
            <h3 className="font-headline-lg-mobile text-[24px] text-primary mb-stack-md uppercase">Sign in</h3>
            <form className="flex flex-col gap-stack-md" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase text-primary" htmlFor="login-email">Email</label>
                <input
                  className="w-full bg-surface-container-low border-2 border-primary sharp-corners px-3 py-2 font-body-md text-body-md text-primary placeholder-text-muted focus:outline-none focus:border-on-tertiary-container"
                  id="login-email"
                  placeholder="you@campus.edu"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm uppercase text-primary" htmlFor="login-password">Password</label>
                <input
                  className="w-full bg-surface-container-low border-2 border-primary sharp-corners px-3 py-2 font-body-md text-body-md text-primary placeholder-text-muted focus:outline-none focus:border-on-tertiary-container"
                  id="login-password"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-body-md text-body-md text-primary font-medium cursor-pointer">
                  <input className="border-2 border-primary sharp-corners" type="checkbox" />
                  Keep me signed in
                </label>
                <a className="font-label-sm text-label-sm uppercase text-on-tertiary-container hover:translate-x-1 transition-transform" href="#">Forgot?</a>
              </div>
              <button className="btn-primary font-label-sm text-label-sm uppercase tracking-widest text-center block py-3 mt-stack-sm sharp-corners" type="submit">
                Sign in
              </button>
            </form>
          </div>

          <p className="font-body-md text-body-md text-primary font-medium text-center mt-stack-lg">
            New around Mysore Road?{' '}
            <Link className="font-bold text-on-tertiary-container hover:translate-x-1 inline-block transition-transform" to="/signup">Create an account</Link>
          </p>
        </div>
      </main>

      <footer className="w-full px-container-margin py-stack-lg flex flex-col gap-stack-sm bg-surface-container border-t-4 border-primary flat no shadows mt-auto">
        <div className="max-w-7xl mx-auto w-full text-center">
          <p className="font-body-md text-body-md text-primary font-medium">
            © CAMPUS SCOUT BENGALURU. EDITORIAL HONESTY GUARANTEED.
          </p>
        </div>
      </footer>
    </>
  )
}
