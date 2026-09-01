import { Link } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-container-margin bg-surface pb-safe border-t-2 border-primary flat no shadows md:hidden h-[72px]">
      <a
        className="flex flex-col items-center justify-center text-primary border-t-4 border-on-tertiary-container pt-2 w-1/3 hover:text-primary scale-95 transition-transform h-full"
        href="#"
      >
        <span className="material-symbols-outlined mb-1">explore</span>
        <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">Explore</span>
      </a>
      <a
        className="flex flex-col items-center justify-center text-text-muted pt-2 w-1/3 hover:text-primary scale-95 transition-transform h-full"
        href="#"
      >
        <span className="material-symbols-outlined mb-1">map</span>
        <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">Areas</span>
      </a>
      <Link
        className="flex flex-col items-center justify-center text-text-muted pt-2 w-1/3 hover:text-primary scale-95 transition-transform h-full"
        to="/signup"
      >
        <span className="material-symbols-outlined mb-1">add_box</span>
        <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold">Submit</span>
      </Link>
    </nav>
  )
}
