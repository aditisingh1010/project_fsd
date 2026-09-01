import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full px-container-margin py-section-gap flex flex-col gap-stack-lg bg-surface-container border-t-4 border-primary flat no shadows mt-auto">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-lg">
        {/* Brand */}
        <div className="font-headline-xl text-[48px] text-primary font-black tracking-tighter uppercase relative">
          CAMPU S SCOUT
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-on-tertiary-container -rotate-1"></div>
        </div>
        {/* Links */}
        <nav className="flex flex-col md:flex-row gap-stack-md font-body-md text-body-md text-primary font-bold">
          <a className="no-underline hover:text-on-tertiary-container hover:translate-x-1 transition-all" href="#">Methodology</a>
          <a className="no-underline hover:text-on-tertiary-container hover:translate-x-1 transition-all" href="#">About</a>
          <Link className="no-underline hover:text-on-tertiary-container hover:translate-x-1 transition-all" to="/signup">Submit</Link>
          <a className="no-underline hover:text-on-tertiary-container hover:translate-x-1 transition-all" href="#">Avoid Scams</a>
        </nav>
      </div>
      {/* Copyright */}
      <div className="max-w-7xl mx-auto w-full border-t-2 border-primary pt-stack-md">
        <p className="font-body-md text-body-md text-primary font-medium">
          © CAMPUS SCOUT BENGALURU. EDITORIAL HONESTY GUARANTEED.
        </p>
      </div>
    </footer>
  )
}
