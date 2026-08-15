import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] overflow-x-hidden">
      {/* ── 1. HERO SECTION (Udaipur Lake Palace Dawn) ── */}
      <header className="relative w-full h-[92vh] min-h-[640px] flex items-end pb-20 md:pb-28 px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgwce2EUUrGN4J1eQVpwtmDJ0AbgjAmdc3SL-5lxE3i9ttAkJxwwuFnU7dUk7mt6VwFa9q1bavGFVCVJLH0SkM19Bin41i0TYJOjHwTmtoBqE7HL0YUJ_aznT5miKJms1W_eJ2OBde46FmuRADF13jTx0XoqTVrUNU2uCoF4ApAJkor-cJ5ESAIUNeGWodrK6J52sBW2-fd2SZ5lawwyMWx3XDMnrJ19s9MxPLoX8HYvIiS1F5uSRqQQ")`,
            }}
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 scrim-bottom" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-white">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FFB68C]">
              UDAIPUR · RAJASTHAN
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Your next journey starts here.
            </h1>
            <p className="text-sm sm:text-lg text-[#FCF9F8]/90 max-w-xl font-normal leading-relaxed pt-2">
              Discover remarkable places across India and turn inspiration into
              a journey worth remembering.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                to="/explore"
                className="bg-[#FCF9F8] text-[#1C1B1B] px-8 py-4 rounded text-xs font-semibold uppercase tracking-[0.15em] text-center hover:bg-[#F0EDED] hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              >
                Explore Destinations
              </Link>
              <Link
                to="/how-it-works"
                className="bg-transparent border border-white/80 text-white px-8 py-4 rounded text-xs font-semibold uppercase tracking-[0.15em] text-center hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. FEATURED DESTINATIONS ASYMMETRICAL EDITORIAL GRID ── */}
      <section
        className="py-24 sm:py-32 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto"
        id="explore"
      >
        <div className="mb-14 sm:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] block mb-2">
              Curated Sanctuary Catalogue
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B]">
              Explore India
            </h2>
            <p className="text-sm sm:text-base text-[#3E312A] mt-2">
              Find your next destination, from timeless heritage cities to
              peaceful escapes.
            </p>
          </div>

          <Link
            to="/explore"
            aria-label="View all curated travel destinations in India"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#6C2F00] hover:text-[#8B4513] group"
          >
            <span>View all destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetrical Grid matching Stitch Screen */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Dominant Feature: Jaipur (8 Cols) */}
          <Link
            to="/explore"
            aria-label="Explore Jaipur, Rajasthan"
            className="group md:col-span-8 relative aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded bg-[#F0EDED] image-zoom block shadow-sm"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRfb4CabRzu7syPAlZu64XE7CneZbXnm05FiZikTKYrSJ586U7Zjqc5FYzVA7UlKmkk7CoYy1uN2xvAncqhrTO7gHzYjqWRhuvo2W-difOdohjlAZuXpQe3CT9GOgNrZ5sjTr0wMx1v9fsWIrhKo4h4Hlv5O_GUtOrJtk2sbVwqxeTQPFWSmlA24QbIlQ7rinp2qbfKE2v-CLfoqx4YqZbDz00zYds_6wLO29Av0FPgdyDCatUjWSdrg"
              alt="Hawa Mahal in Jaipur Rajasthan"
              loading="lazy"
              decoding="async"
              width="800"
              height="600"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#FFB68C] mb-1.5">
                Rajasthan
              </p>
              <h3 className="font-serif text-3xl sm:text-5xl font-bold">
                Jaipur
              </h3>
            </div>
          </Link>

          {/* Secondary Story: Kerala (4 Cols) */}
          <Link
            to="/explore"
            aria-label="Explore Kerala, South India"
            className="group md:col-span-4 relative aspect-[4/5] md:aspect-auto md:h-full overflow-hidden rounded bg-[#F0EDED] image-zoom block shadow-sm"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmLiP1MI_0kZ4mqRddpYohwseVObNOmBXIomVMBJHHlTkp3huLixkICs6bjDDWkSU8tWe4squdP2XlQZVTK4BZ0CgFCKp2gTxF7W_6I9W0XnpF36dBAS2CSaSnx1G3zaM3YTKQ2UNggESsg259w_wXmrUAgLgo8V23LhyDci9dyf1ddwHnp1RqH7s4yfNQ87TId9BIpE2bqJHPdgmjQyhpK13Kv1e85f4IV_vhbK_4NAkATSJWfJUohg"
              alt="Kerala Backwaters and palm-lined lagoons"
              loading="lazy"
              decoding="async"
              width="400"
              height="500"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#FFB68C] mb-1.5">
                South India
              </p>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold">
                Kerala
              </h3>
            </div>
          </Link>

          {/* Smaller Story 1: Manali (4 Cols) */}
          <Link
            to="/explore"
            aria-label="Explore Manali, Himachal Pradesh"
            className="group md:col-span-4 relative aspect-[4/5] overflow-hidden rounded bg-[#F0EDED] image-zoom block shadow-sm"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD89wvqOvWjPYWb1rW_z5hAf4_HERisEb-L-7tiX1n_RMEMO3hjubz5Db8Wv3f3rBAEuPsi3u7BLU7kH4KkeqqE0VA4b5iFa6sy2O_d3cgJ4nhYZGWkSJogx8rpONtV0M37kxuCa9wYpL-biOR7wXOOcJIsQKa9DnJ9q-Uwz--1UqRPcI8A5_1qA8xATZK36xc9cpWBqA5-_VpmtDKzLb0MyYdUOLvyuVGcv--gtT4tdhjXZaaovjJt0Q"
              alt="Himalayan Mountain Peaks in Manali"
              loading="lazy"
              decoding="async"
              width="400"
              height="500"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#FFB68C] mb-1.5">
                Himachal Pradesh
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Manali
              </h3>
            </div>
          </Link>

          {/* Smaller Story 2: Varanasi (4 Cols) */}
          <Link
            to="/explore"
            aria-label="Explore Varanasi, Uttar Pradesh"
            className="group md:col-span-4 relative aspect-[4/5] overflow-hidden rounded bg-[#F0EDED] image-zoom block shadow-sm"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIUJ26Od1PImTs6kEQDwDQOgafSmPqExlb_2AQiqfBwKO0xEgb9GL1Bg_VuOzBEPiZAjoCpuhG9rom8ncgREzWNahiQuzhYltUdTzj4WOts3WxWozt4o3ipY5z04JSMHP0mX_DgHuLr5QIx9SuBSvPGsLaM-Ib27g3rW45Tumef_it2FKa5xbLE-RptWVm-SOQFc841LBzEsEkrwDgL5XVlLc532PERgcbTulos0Kn93hPXzeFh2TXYg"
              alt="Ganges Ghats Sunset in Varanasi"
              loading="lazy"
              decoding="async"
              width="400"
              height="500"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#FFB68C] mb-1.5">
                Uttar Pradesh
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Varanasi
              </h3>
            </div>
          </Link>

          {/* Smaller Story 3: Goa (4 Cols) */}
          <Link
            to="/explore"
            aria-label="Explore Goa, West Coast"
            className="group md:col-span-4 relative aspect-[4/5] overflow-hidden rounded bg-[#F0EDED] image-zoom block shadow-sm"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmiXfQ14OuWTiO4NrMPZltrKS2oQb-QLu-nt00xw0fammXH5j91_B1SnMRzzqqKnJxNl_ipvkDYxDA7kWdRfEUokmq6TmnZvt8S42GyNF1i5slVRGARrX-IVbrvlF9Mql_qWA1g8SzLicKa39rx2hqf5NH2Ib9hg04pEjwPCxbuprt34zZPSa2cbGxUQMefv3EPOPPdPMbKst_YqBW7rDwpkP7TAjJjZIq6_qy5C3ivTtfHfCk_g7dxA"
              alt="Portuguese Heritage Architecture in Goa"
              loading="lazy"
              decoding="async"
              width="400"
              height="500"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#FFB68C] mb-1.5">
                West Coast
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">Goa</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 3. WHY PACKGO (Editorial 3 Pillars) ── */}
      <section className="bg-[#F6F3F2] py-24 sm:py-32 px-4 sm:px-8 lg:px-16 border-y border-[#DAC2B6]/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B] max-w-3xl mx-auto mb-20">
            Travel planning, without the clutter.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="group text-center space-y-4">
              <p
                aria-hidden="true"
                className="font-serif text-6xl font-light text-[#877369]/60 group-hover:text-[#6C2F00] transition-colors duration-500"
              >
                01
              </p>
              <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
                Discover
              </h3>
              <p className="text-xs sm:text-sm text-[#3E312A] max-w-xs mx-auto leading-relaxed">
                Explore carefully curated destinations worth visiting that
                inspire your next journey across the subcontinent.
              </p>
            </div>

            <div className="group text-center space-y-4">
              <p
                aria-hidden="true"
                className="font-serif text-6xl font-light text-[#877369]/60 group-hover:text-[#6C2F00] transition-colors duration-500"
              >
                02
              </p>
              <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
                Plan
              </h3>
              <p className="text-xs sm:text-sm text-[#3E312A] max-w-xs mx-auto leading-relaxed">
                Turn raw inspiration into your own structured, actionable
                itinerary seamlessly with live attraction details.
              </p>
            </div>

            <div className="group text-center space-y-4">
              <p
                aria-hidden="true"
                className="font-serif text-6xl font-light text-[#877369]/60 group-hover:text-[#6C2F00] transition-colors duration-500"
              >
                03
              </p>
              <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
                Organize
              </h3>
              <p className="text-xs sm:text-sm text-[#3E312A] max-w-xs mx-auto leading-relaxed">
                Keep your journey, budget records, weather forecasts, and
                packing checklists together in one sanctuary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS VISUAL JOURNEY STORIES ── */}
      <section
        className="py-24 sm:py-32 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto"
        id="how-it-works"
      >
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] block mb-2">
            The PackGo Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B] mb-4">
            How it works
          </h2>
          <p className="text-sm sm:text-base text-[#3E312A]">
            A simple, intentional process to take you from dreaming to
            experiencing.
          </p>
        </div>

        <div className="flex flex-col space-y-24 sm:space-y-32">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="max-w-md ml-auto space-y-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#6C2F00]">
                  01
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
                  Discover
                </h3>
                <p className="text-xs sm:text-sm text-[#3E312A] leading-relaxed">
                  Browse our editorial collections to find destinations that
                  resonate with your travel style. Immerse yourself in
                  high-quality visual stories and local guidance.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="aspect-[4/3] w-full overflow-hidden rounded bg-[#F0EDED] shadow-md">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuGLX51M6zk-3IyVl6jlS1BceAaSsqQwVj_63yO22EUKN1FlAtHk9zPHkisIBF4YTxxtHyVBI4dDdgnyfeHHfvfNJizxVkk-LW95pc72tNXKZ3X19o88RtAYDz4Q5GbQWEJsKDebcoz1AlrnBcU07RnyFe-UMZg33OjcJp6K5ud6PLwDMwJxm6nG0DnChyYRvw2n8v35TlITyYv2pkTxDm0uQ2gdS5UBWxYA_jLTAM7DwkSJQo6LUOYA"
                  alt="Discovering destinations digitally"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="450"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/3] w-full overflow-hidden rounded bg-[#F0EDED] shadow-md">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3R8ShNgEmS5ECeXeRuNpYnlY5WjIsErRl3FOYlDR6rGiSlyhx4IebROuCyg5pvH5c-Cv-NmSHk-J5LstQ-muebIOZvJNRuD8_OJwX17hoMLgRHrVkj7kakUnKB-2tKfbI9YvW2r9MpwHAb2Aft2kJ6iibmrZO1q0t755_Uaf6fV2seNhuvgBEzafSMGdlZYWa3UepzdosPBXbOiqa2oiQsf_MNPZe5kBQxg75Pw3ZjTmsYLiG-C2ISQ"
                  alt="Planning a mindful travel itinerary"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="450"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="max-w-md space-y-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#6C2F00]">
                  02
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
                  Plan
                </h3>
                <p className="text-xs sm:text-sm text-[#3E312A] leading-relaxed">
                  Select the places you want to visit and build a structured,
                  elegant itinerary. Organize your transit, accommodation, and
                  daily activities effortlessly.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="max-w-md ml-auto space-y-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#6C2F00]">
                  03
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
                  Travel
                </h3>
                <p className="text-xs sm:text-sm text-[#3E312A] leading-relaxed">
                  Access your entire plan on the go, with a clutter-free view of
                  your journey. Use language translation and live weather
                  updates to focus on experiencing the moment.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="aspect-[4/3] w-full overflow-hidden rounded bg-[#F0EDED] shadow-md">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpL_bYcg97s4NIhELB79rPvWJ5aRdMvXWHK0kSyY77K5BCz2Uc88wlQFv96sEF76yIQrqmg1IjciBvnChDVrOGjfsIvve0vYswyxAC5OqGvTHk-iQptI2RQDE3rPrU2swBl3F-pYSSoXGsRQ1RilAAwYGCiAEeGvf67aAnfQ2SzJ551p3EUdDrfK6RDtCcwHdb-kN3jnAKNQOIXxtNNctzT6DZayssn4hjJWt02kjqbE8HwB1pIejYVg"
                  alt="Solitary traveler in the mountains"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="450"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FINAL CALL TO ACTION (Thar Desert Dunes Sunset) ── */}
      <section className="relative py-32 md:py-48 px-4 sm:px-8 lg:px-16 flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIT-qJbutgZD7VC7Jr6c8ADKqLCZRth_B5glFRFqYc8YkAAixq-jAJEhPe2p4lWmoNPitTMzVe-4mSUkF-GYMz-BOlIJhJZDlPOUBmmFnfOWlE6a6KAKPfLz2YgH1hc5md8IyHWLBN-mi1YaGZxDgh6glRYrWStWImhFs90VddC0IzXfS4z21ETrTIpFzceepE25yljwY_Eyib2rZ6ddxqW8pJJbFmkpOWp3f4gWEm6JUYQbGvnnrKiw")`,
            }}
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-white space-y-6">
          <h2 className="font-serif text-3xl sm:text-6xl font-bold leading-tight">
            Ready to plan your next journey?
          </h2>
          <p className="text-sm sm:text-lg text-white/90 max-w-xl mx-auto font-normal">
            Choose a destination and start building a trip that is truly yours.
          </p>
          <div className="pt-4">
            <Link
              to="/explore"
              className="inline-block bg-[#FCF9F8] text-[#1C1B1B] px-10 py-4.5 rounded text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#F0EDED] hover:-translate-y-0.5 transition-all duration-300 shadow-xl"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
