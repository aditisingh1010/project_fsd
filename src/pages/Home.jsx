import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import BottomNav from '../components/BottomNav.jsx'

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-container-margin">
        {/* Hero Section */}
        <section className="py-section-gap flex flex-col items-start gap-stack-lg border-b-2 border-primary border-l-0 border-r-0 border-t-0 pb-section-gap mt-stack-md relative">
          <div className="sticker-badge top-8 right-0 md:right-12 rotate-[8deg]">No BS Allowed</div>
          <h2 className="font-display-lg text-display-lg text-primary max-w-3xl leading-tight md:text-[72px] md:leading-[1]">
            The student city guide that doesn&apos;t lie to you.
          </h2>
          <p className="font-body-lg text-body-lg text-primary max-w-2xl border-l-4 border-on-tertiary-container pl-stack-md font-medium">
            No broker jargon. Just editorial honesty on PGs, cheap food, and internships around Mysore Road campuses.
          </p>
          {/* Search / Filter Component */}
          <div className="w-full max-w-2xl bg-surface editorial-border p-unit flex flex-col gap-unit mt-stack-md shadow-brutal transform -rotate-1">
            <div className="flex items-center px-stack-sm py-unit bg-surface-container-low border-b-2 border-primary sharp-corners">
              <span className="material-symbols-outlined text-primary mr-stack-sm">search</span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 font-body-md text-body-md text-primary placeholder-text-muted"
                placeholder="PG near Pattanagere, cheap lunch..."
                type="text"
              />
            </div>
            {/* Category Chips */}
            <div className="flex flex-wrap gap-unit px-stack-sm pb-unit pt-unit">
              <span className="font-label-sm text-label-sm uppercase border-2 border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white cursor-pointer transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">PGs</span>
              <span className="font-label-sm text-label-sm uppercase border-2 border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white cursor-pointer transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Food</span>
              <span className="font-label-sm text-label-sm uppercase border-2 border-primary px-3 py-1 text-primary hover:bg-primary hover:text-white cursor-pointer transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Internships</span>
              <span className="font-label-sm text-label-sm uppercase bg-on-tertiary-container text-white px-3 py-1 cursor-pointer border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-2">Verified</span>
            </div>
          </div>
        </section>

        {/* Start with your area (Bento Layout) */}
        <section className="py-section-gap border-b-2 border-primary border-l-0 border-r-0 border-t-0">
          <h3 className="font-headline-xl text-headline-xl text-primary mb-stack-lg">Start with your area.</h3>
          <div className="bento-grid">
            {/* Large Feature Area */}
            <a
              className="col-span-12 md:col-span-8 group relative h-64 md:h-96 editorial-border overflow-hidden bg-surface flex flex-col justify-end p-stack-md shadow-brutal hover:-translate-y-1 hover:translate-x-1 transition-transform"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center z-0 filter grayscale opacity-90 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjW_4sGVRtVqzOd4di8s4BrYfFm3VD6kDew5K0P9K23DQqQZ4pqr1Cd2CJuimaU72L3InxmkNmxSbx2_QajiTR4pKGtl66dt6X3mL1uTmVSnOVkFGBJPCa0wwZmEq5HezDTgZbTiAHyWeaYfIYhrQyDCA4aj8hCrEnAYKM9OQ_0lafNspNWV6Nff3-lvG9QQ0xF8gY5FPs8Gkfq0VMOZt6xLBg6LdNilt8-wIsRkok5HGnSTZj-Q_4NA')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <div className="sticker-badge top-4 left-4">Hot Spot</div>
              <div className="relative z-20">
                <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-widest mb-unit block">Primary Hub</span>
                <h4 className="font-headline-lg-mobile text-[40px] md:text-[56px] text-surface-bright leading-none mb-2">Pattanagere</h4>
              </div>
            </a>
            {/* Secondary Area 1 */}
            <a
              className="col-span-6 md:col-span-4 group relative h-48 md:h-96 editorial-border overflow-hidden bg-surface flex flex-col justify-end p-stack-sm shadow-brutal hover:-translate-y-1 hover:translate-x-1 transition-transform"
              href="#"
            >
              <div
                className="absolute inset-0 bg-cover bg-center z-0 filter grayscale opacity-90 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDotqexLbhdyMHu8bMWkwV9v4X67YF1OtcQ1cXbKMUBl2KTgIQJQfZU1xUIqLVhjzByrKhcdbYZW30O5j9I6HTgBfAurTqeGShk1OfJmO6FOcHs-oiVN7jINGwo4PuQhvQhtxjAN8iRSIwK0ENxTXX8ZowIp4zt5uqmCCFVQVTJq-fQJjDJIer_WsJpNUa4t6J0OTPFKHivuAFJtChUV1o1ZJMkfdbwJ87N1-lF6QTNkZrUmUvWBrDn2Q')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <div className="relative z-20">
                <h4 className="font-headline-lg-mobile text-[32px] md:text-[40px] text-surface-bright leading-none mb-1">Kengeri</h4>
              </div>
            </a>
            {/* Secondary Area 2 */}
            <a
              className="col-span-6 md:col-span-6 group relative h-48 editorial-border overflow-hidden bg-surface-container-high flex flex-col justify-end p-stack-sm shadow-brutal hover:-translate-y-1 hover:translate-x-1 transition-transform"
              href="#"
            >
              <div className="absolute inset-0 bg-accent-olive z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-20">
                <h4 className="font-headline-lg-mobile text-[32px] text-primary leading-none mb-1">RR Nagar</h4>
                <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase">Student Suburb</span>
              </div>
            </a>
            {/* Secondary Area 3 */}
            <a
              className="col-span-12 md:col-span-6 group relative h-48 editorial-border overflow-hidden bg-surface-container flex flex-col justify-end p-stack-sm shadow-brutal hover:-translate-y-1 hover:translate-x-1 transition-transform"
              href="#"
            >
              <div className="absolute inset-0 bg-on-tertiary-container z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-20">
                <h4 className="font-headline-lg-mobile text-[32px] text-primary leading-none mb-1">Banashankari</h4>
                <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase">Transit &amp; Food</span>
              </div>
            </a>
          </div>
        </section>

        {/* This week's honest picks */}
        <section className="py-section-gap border-b-2 border-primary border-l-0 border-r-0 border-t-0">
          <div className="flex justify-between items-end mb-stack-lg relative">
            <h3 className="font-headline-xl text-headline-xl text-primary max-w-md relative z-10">This week&rsquo;s honest picks.</h3>
            <div className="absolute w-24 h-6 bg-secondary-container -bottom-2 left-0 z-0 -rotate-2"></div>
            <a className="btn-secondary px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest hidden md:block" href="#">See all reviews</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg mt-8">
            {/* Listing Card 1 (PG) */}
            <article className="bg-surface editorial-border flex flex-col h-full group cursor-pointer shadow-brutal hover:-translate-y-1 hover:translate-x-1 transition-transform relative">
              <div className="sticker-badge -top-3 -right-3 rotate-6 bg-accent-olive">Honest Pick</div>
              <div className="relative w-full aspect-[3/2] overflow-hidden border-b-2 border-primary">
                <img
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                  alt="Green Nest Girls PG building facade"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4zfrlqmZ5C-lLsZKCEzaIOs8uBS5C1mqDG87I_LQ4ujI9DxHUZ5jdUwkJnYAgTD83N7gg4odI9CwsLn2WY2TFUVc1OTmXaEt4QWwMzvcIG1pC0P6sTqfZpowa-vxioT4mXrQt1KSYDbL8ZQL3ycig3FYahROim4D1WS5EHzkAvGThzXqSbL2j7lrm08ZilEGmcly1jEXH1P2SppDvwRMl8GGxUJnVSpOa2iTxsvsAz_h3zW4l3wj7Vg"
                />
                <div className="absolute top-unit left-unit bg-surface px-2 py-1 border-2 border-primary flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-[14px] text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-label-sm text-label-sm uppercase text-primary">Verified</span>
                </div>
              </div>
              <div className="p-stack-md flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-headline-lg-mobile text-[28px] text-primary leading-tight">Green Nest Girls PG</h4>
                  <span className="font-numerical-data text-numerical-data text-primary bg-secondary-container px-2 py-1 border-2 border-primary rotate-2">
                    ₹8,500<span className="font-label-sm text-label-sm text-primary">/mo</span>
                  </span>
                </div>
                <p className="font-body-md text-body-md text-primary font-medium mb-stack-md">Pattanagere • 5 min walk to Global Village Tech Park</p>
                <div className="the-verdict p-stack-sm mb-stack-md mt-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-label-sm text-label-sm uppercase text-black block mb-1">The Verdict</span>
                  <p className="font-body-md text-body-md text-white font-medium">Clean facilities and strict security, but the Wi-Fi drops frequently during peak hours.</p>
                </div>
              </div>
            </article>
            {/* Listing Card 2 (Food) */}
            <article className="bg-surface editorial-border flex flex-col h-full group cursor-pointer shadow-brutal hover:-translate-y-1 hover:translate-x-1 transition-transform">
              <div className="relative w-full aspect-[3/2] overflow-hidden border-b-2 border-primary">
                <img
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-500"
                  alt="South Indian meals thali on a steel plate"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRSARNdv0aY4RcYXY_WhaIBsLCbL3wmtTNaQpxYFEExs7i028gKvtCBtJQ0BqQ3uw9hgdgJ65yalUeyTElAgpcpY-v13WHFoQYvchFzHfkGQy2_u-FAwnsaPK_h-X6BrQjFsy1SK2zSDTO6dhhnzCMMhQnYV3S2tmV2RZwwxKl1b_P2aeI-50t1k3UlQTYTDnCsKF5RrXZjdtIlxbNxNkyPFt-bCLnxQONCpdz6Q28qdkNJ0n_QsU6Nw"
                />
                <div className="absolute top-unit left-unit bg-surface px-2 py-1 border-2 border-primary flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                  <span className="font-label-sm text-label-sm uppercase text-primary">Food</span>
                </div>
              </div>
              <div className="p-stack-md flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-headline-lg-mobile text-[28px] text-primary leading-tight">Anna&apos;s Meals</h4>
                  <span className="font-numerical-data text-numerical-data text-primary bg-secondary-container px-2 py-1 border-2 border-primary -rotate-2">
                    ₹60<span className="font-label-sm text-label-sm text-primary">/meal</span>
                  </span>
                </div>
                <p className="font-body-md text-body-md text-primary font-medium mb-stack-md">Kengeri Main Road • Near Bus Depot</p>
                <div className="the-verdict p-stack-sm mb-stack-md mt-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] !rotate-[2deg] !bg-accent-olive">
                  <span className="font-label-sm text-label-sm uppercase text-secondary-container block mb-1">The Verdict</span>
                  <p className="font-body-md text-body-md text-white font-medium">Unbeatable value for unlimited rice and sambar. Expect a line during lunch hours.</p>
                </div>
              </div>
            </article>
          </div>
          <a className="btn-primary font-label-sm text-label-sm uppercase tracking-widest text-center block mt-stack-lg py-3 md:hidden" href="#">
            See all reviews
          </a>
        </section>

        {/* How it works (Editorial Layout) */}
        <section className="py-section-gap border-b-2 border-primary border-l-0 border-r-0 border-t-0">
          <h3 className="font-headline-xl text-headline-xl text-primary text-center mb-section-gap">Our Methodology.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg text-center md:text-left">
            <div className="flex flex-col items-center md:items-start border-b-2 md:border-b-0 md:border-r-2 border-primary pb-stack-lg md:pb-0 md:pr-stack-lg">
              <span className="font-display-lg text-[80px] leading-none text-primary mb-stack-sm font-black drop-shadow-[4px_4px_0px_#cf6721]">01</span>
              <h4 className="font-headline-lg-mobile text-[32px] text-primary mb-2">We Verify</h4>
              <p className="font-body-md text-body-md text-primary font-medium">We visit listings anonymously. No broker setups, no staged photos. We see what you will see.</p>
            </div>
            <div className="flex flex-col items-center md:items-start border-b-2 md:border-b-0 md:border-r-2 border-primary pb-stack-lg md:pb-0 px-0 md:px-stack-lg">
              <span className="font-display-lg text-[80px] leading-none text-primary mb-stack-sm font-black drop-shadow-[4px_4px_0px_#cf6721]">02</span>
              <h4 className="font-headline-lg-mobile text-[32px] text-primary mb-2">We Write the Catch</h4>
              <p className="font-body-md text-body-md text-primary font-medium">Every place has a downside. We put it front and center in a high-contrast warning box. No surprises.</p>
            </div>
            <div className="flex flex-col items-center md:items-start pt-0 md:pt-0 pl-0 md:pl-stack-lg">
              <span className="font-display-lg text-[80px] leading-none text-primary mb-stack-sm font-black drop-shadow-[4px_4px_0px_#cf6721]">03</span>
              <h4 className="font-headline-lg-mobile text-[32px] text-primary mb-2">You Decide</h4>
              <p className="font-body-md text-body-md text-primary font-medium">Armed with editorial honesty, you contact owners directly or make informed choices on ground.</p>
            </div>
          </div>
        </section>

        {/* Avoid These (Scam Callouts) */}
        <section className="py-section-gap">
          <h3 className="font-headline-xl text-headline-xl text-primary mb-stack-lg">Avoid these common traps.</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            <div className="the-catch p-stack-md flex flex-col gap-unit relative">
              <div className="absolute -top-4 -left-4 bg-primary text-white font-label-sm uppercase px-2 py-1 rotate-[-10deg] border-2 border-white">Scam Alert</div>
              <div className="flex items-center gap-2 mb-2 mt-2">
                <span className="material-symbols-outlined text-[32px] text-primary">warning</span>
                <h4 className="font-headline-lg-mobile text-[28px] text-primary">The &quot;QR Code Booking&quot;</h4>
              </div>
              <p className="font-body-md text-body-md text-primary font-bold">
                Never scan a QR code or send money via UPI before physically visiting a PG. Scammers often post fake photos of premium rooms and demand a &quot;holding deposit&quot; online.
              </p>
              <span className="font-label-sm text-label-sm uppercase text-on-tertiary-container mt-4 block border-t-2 border-primary pt-2">Reported in: Kengeri, RR Nagar</span>
            </div>
            <div className="the-catch p-stack-md flex flex-col gap-unit relative !rotate-[-1deg] !box-shadow-[6px_6px_0px_#3F5E4A]">
              <div className="absolute -top-4 -left-4 bg-primary text-white font-label-sm uppercase px-2 py-1 rotate-[-5deg] border-2 border-white">Scam Alert</div>
              <div className="flex items-center gap-2 mb-2 mt-2">
                <span className="material-symbols-outlined text-[32px] text-primary">warning</span>
                <h4 className="font-headline-lg-mobile text-[28px] text-primary">Hidden Maintenance Fees</h4>
              </div>
              <p className="font-body-md text-body-md text-primary font-bold">
                Always ask for the final price *in writing*. Many PGs quote a low base rent but add exorbitant mandatory fees for washing machines, geysers, or Wi-Fi upon move-in.
              </p>
              <span className="font-label-sm text-label-sm uppercase text-on-tertiary-container mt-4 block border-t-2 border-primary pt-2">Reported across all areas</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
