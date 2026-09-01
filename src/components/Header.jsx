import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col px-container-margin py-stack-sm bg-background border-b-2 border-primary">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto h-12">
        {/* Leading Icon */}
        <div className="flex items-center text-primary">
          <span className="material-symbols-outlined text-3xl">location_on</span>
        </div>
        {/* Headline / Brand */}
        <div className="flex-grow text-center">
          <h1 className="font-headline-lg-mobile text-[28px] md:text-[36px] tracking-tighter font-black text-primary uppercase">
            CAMPU S SCOUT
          </h1>
        </div>
        {/* Trailing Action */}
        <div className="flex items-center">
          <Link
            className="font-label-sm text-label-sm uppercase tracking-widest text-primary border-2 border-primary px-3 py-1 sharp-corners hover:bg-on-tertiary-container hover:text-white transition-colors duration-200 shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] inline-block"
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
      {/* Desktop Navigation Cluster (Hidden on Mobile) */}
      <nav className="hidden md:flex justify-center gap-stack-lg mt-unit pt-unit w-full max-w-7xl mx-auto border-t-2 border-primary">
        <a className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold border-t-4 border-on-tertiary-container pt-2" href="#">Explore</a>
        <a className="font-label-sm text-label-sm uppercase tracking-widest text-primary pt-2 hover:text-on-tertiary-container transition-colors duration-200" href="#">Areas</a>
      </nav>
    </header>
  )
}
