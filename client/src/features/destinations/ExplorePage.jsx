import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { destinationsApi } from "../../services/api/destinationsApi";
import LoadingState from "../../components/LoadingState";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  X,
} from "lucide-react";

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filter state
  const activeZone = searchParams.get("zone") || "all";
  const searchQuery = searchParams.get("search") || "";
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const gridSectionRef = useRef(null);
  const ITEMS_PER_PAGE = 8;

  const zones = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular" },
    { id: "North India", label: "North India" },
    { id: "South India", label: "South India" },
    { id: "West India", label: "West India" },
    { id: "East India", label: "East India" },
    { id: "Central India", label: "Central India" },
  ];

  // Keep local search input synchronized if URL param changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      if (searchQuery) params.search = searchQuery;
      if (activeZone !== "all" && activeZone !== "popular") {
        params.zone = activeZone;
      }

      const res = await destinationsApi.getAll(params);
      const resData = res.data;

      if (resData && Array.isArray(resData.destinations)) {
        setDestinations(resData.destinations);
        setTotalPages(resData.totalPages || 1);
        setTotalCount(resData.total || 0);
      } else if (Array.isArray(resData)) {
        // Fallback filtering if backend returns plain array
        const filtered = resData.filter((dest) => {
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchName = dest.name?.toLowerCase().includes(q);
            const matchCity = dest.city?.toLowerCase().includes(q);
            const matchState = dest.state?.toLowerCase().includes(q);
            if (!matchName && !matchCity && !matchState) return false;
          }
          if (activeZone !== "all" && activeZone !== "popular") {
            if (
              dest.zone &&
              !dest.zone.toLowerCase().includes(activeZone.toLowerCase())
            ) {
              return false;
            }
          }
          return true;
        });

        const calculatedTotalPages =
          Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
        setTotalPages(calculatedTotalPages);
        setTotalCount(filtered.length);

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        setDestinations(filtered.slice(start, start + ITEMS_PER_PAGE));
      } else {
        setDestinations([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      console.warn("Failed to fetch destinations:", err);
      setError("Unable to load the destinations catalogue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [activeZone, searchQuery, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = {};
    if (activeZone !== "all") nextParams.zone = activeZone;
    if (localSearch.trim()) nextParams.search = localSearch.trim();
    nextParams.page = "1";
    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    const nextParams = {};
    if (activeZone !== "all") nextParams.zone = activeZone;
    nextParams.page = "1";
    setSearchParams(nextParams);
  };

  const handleZoneSelect = (zoneId) => {
    const nextParams = {};
    if (zoneId !== "all") nextParams.zone = zoneId;
    if (searchQuery) nextParams.search = searchQuery;
    nextParams.page = "1";
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    const nextParams = {};
    if (activeZone !== "all") nextParams.zone = activeZone;
    if (searchQuery) nextParams.search = searchQuery;
    nextParams.page = String(newPage);
    setSearchParams(nextParams);

    if (gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Curated fallback if DB is completely empty and no search/filters applied
  const isFiltered = Boolean(
    searchQuery.trim() || (activeZone !== "all" && activeZone !== "popular"),
  );

  const defaultCuratedDestinations = [
    {
      _id: "jaipur",
      name: "Jaipur",
      state: "Rajasthan",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDAfnq0VBo3FZ9nKCt6lqkYkXkMIYPYXfSB8g-MkvhXQm-WQiFNv3o5gnvs0oe15uMp0yahwQi4WbxZJWu4rZqs4j-0Z8ZVLSaSmO2x2847ohAT5kpg2aG1W-_-DCu7muPtt3qS-7h99qV_Caomzeq2njg3zD8BhSD__ZbL0D1NYzUwJ6ebOeTHETxuj0ZJI_GqwlVk4rqZhb7SQpkYBjEH01oiKu_tYpbMR7zZxHREZSKmZZE0S6XUCg",
      gridSpan: "md:col-span-8 h-[480px]",
    },
    {
      _id: "kerala",
      name: "Kerala",
      state: "South India",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCZaWG-1I37o30-x7EMPUBOx8gxI6RvWQIUMhH_1jZG6dudLwDq8z0gukjByWNoCg6-2frqu8j8jHIhv50VLU2G3KWzyzhdjCkfPHvI7h4YnMzWoQL43RDx93ZHThdtXC8owpZg-1GSinW37ltxYK-5Z6k-ISB7TFGDq6jVutgnGwPoYAzOnryR3dYOZgrvlSZqEmXnehyx-QKgMYEQLJl_3dXsbXWjOh78ZWes_gntHGfZVJqNNTqKmg",
      gridSpan: "md:col-span-4 h-[480px]",
    },
    {
      _id: "goa",
      name: "Goa",
      state: "West Coast",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC1HlmHFMnbrftuq8151JdqUBJcq_kkrv4bcTdxXYWoa1zO2pCkr4Sk6YPM90whHi-t2iNjolmhOkarRRb9MzOj3N3FDSpoxWucNqtD6W_uxPC8blfPD9xk1cdhiCarqqFk9Lo0H-vTJHOBu0TgpMJslVoWk1EvNWJci1RkFwva5Rd--kg1Puw1wGh84gLa-eVo-iXRJpfVsrgz6YFH1I04QcVpX-yBPy6U9tb5l9M2-leCnSKN5QbSoQ",
      gridSpan: "md:col-span-4 h-[400px]",
    },
    {
      _id: "varanasi",
      name: "Varanasi",
      state: "Uttar Pradesh",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAB1XtALEQrneuH0KhU7_s-2F5o7VLYETnd2Wdw9IVWt-6LqqaE2a7ZK8wrIYQgG171adUp1IxjE3bo6PX3ji6rf0HpUIDtBexWzUajhWrM1dr6m41rnOXSkZeoJQ61pRTCFgtgjNc5VpFfk_3_ALCIbhDGMw-9ivzLZmVpoO51_Hl1cuAN2Uuy-Y8x3DPldlGHZHN1arM-nPmyGCXJBTqqBlHyQCvIn3Zf0Iv3Sv4Dk-0_Uo_VnD5PGA",
      gridSpan: "md:col-span-4 h-[400px]",
    },
    {
      _id: "manali",
      name: "Manali",
      state: "Himachal Pradesh",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAerAQxqxzgJBiT-gJQQaWKf8X_NbfvMkZBIHn0SvVozFMx_DdbIjHN-duzejabsNNYHOVTgBhHxB73yKB9VbRX-AtBM55SQjNqSz2V8qQ3lZhgzEKwtbw-GUDe25LBS0kMDkHKfQ3Zp9lrJvzVpZbQQqE0Z0fPkAO7f6zM3YwFm2Cd7dPBxspEp55m310sct7XQ4Z6OOjnxHFH8Ofa2Lofo34pmM3bgBZQWn_u_SHLwWyiZTHAHgTVNQ",
      gridSpan: "md:col-span-4 h-[400px]",
    },
  ];

  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] min-h-screen pb-32">
      {/* ── 1. HERO HEADER ── */}
      <header className="w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pt-32 pb-14 sm:pt-44 sm:pb-20 flex flex-col items-center text-center">
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4 text-[#1C1B1B]">
          Explore India
        </h1>
        <p className="text-base sm:text-lg text-[#54433A] max-w-xl mb-12">
          Discover places worth remembering, from historic cities to peaceful
          escapes.
        </p>

        {/* Search Bar with Submit & Clear Button */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-2xl relative"
        >
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#877369]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search destinations, cities or states..."
            className="w-full bg-transparent border-b border-[#DAC2B6] focus:border-[#6C2F00] px-12 py-4 text-base sm:text-lg text-[#1C1B1B] placeholder-[#877369]/60 focus:outline-hidden transition-colors"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#877369] hover:text-[#1C1B1B] transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </header>

      {/* ── 2. CATEGORY & ZONE FILTER TABS ── */}
      <section className="w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pb-16 overflow-x-auto hide-scrollbar">
        <div className="flex gap-8 whitespace-nowrap border-b border-[#DAC2B6]/30 pb-4">
          {zones.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => handleZoneSelect(z.id)}
              className={`text-xs font-semibold uppercase tracking-widest pb-4 -mb-[18px] transition-colors cursor-pointer ${
                activeZone === z.id
                  ? "text-[#6C2F00] border-b-2 border-[#6C2F00]"
                  : "text-[#54433A] hover:text-[#6C2F00]"
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. FEATURED DESTINATION HERO (Only when not actively searching) ── */}
      {!searchQuery &&
        currentPage === 1 &&
        (activeZone === "all" ||
          activeZone === "popular" ||
          activeZone === "North India") && (
          <section className="w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pb-24">
            <Link
              to="/destinations/udaipur"
              className="relative w-full h-[520px] sm:h-[720px] overflow-hidden rounded block bg-[#1C1B1B] group image-zoom cursor-pointer shadow-sm"
            >
              <div
                className="w-full h-full bg-cover bg-center absolute inset-0 transform transition-transform duration-1000 group-hover:scale-105"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxWl-xnZHodPN0zPTcw8fKTdasw9qPGifOaAwnFmL5RWafIdVS4ZeMfklhfQaYYA9YLh39uhYHkczYdkEbmZez0M3EzYunQbERz4uum7mnEHiPamor4vhcsWr_RoqiVHYYWtNxdK_iizMbMsC9436FC0KoRSmENslHNKcQbQxk8Dx_LNHtQLEiQMWQgqpvcwo7gXFPtW0_x0ijuTJQSFNHT5dEaaOwVIZvqYpBI-cyOiB_G6ydekRcsw")`,
                }}
              />
              <div className="absolute inset-0 scrim-bottom" />
              <div className="absolute bottom-0 left-0 p-8 sm:p-16 w-full md:w-2/3 text-white space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#FFB68C] block mb-2">
                  Featured Destination
                </span>
                <h2 className="font-serif text-4xl sm:text-6xl font-bold">
                  Udaipur, Rajasthan
                </h2>
                <p className="text-sm sm:text-base text-[#FCF9F8]/90 max-w-xl leading-relaxed">
                  Lakes, palaces and timeless streets make Udaipur one of
                  India’s most atmospheric escapes.
                </p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white border-b border-white pb-1 group-hover:opacity-80 transition-opacity">
                    <span>Explore Udaipur</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

      {/* ── 4. ASYMMETRICAL EDITORIAL DESTINATIONS GRID ── */}
      <section
        ref={gridSectionRef}
        className="w-full px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-12"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DAC2B6]/30 pb-4">
          <div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
              {searchQuery ? `Search Results` : `Discover more`}
            </h3>
            <p className="text-xs text-[#54433A] mt-1">
              {searchQuery
                ? `Showing destinations matching "${searchQuery}"`
                : `Curated escapes and royal sanctuaries across the subcontinent.`}
            </p>
          </div>

          {totalCount > 0 && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#877369]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of{" "}
              {totalCount} places
            </span>
          )}
        </div>

        {loading ? (
          <LoadingState message="Unfurling destination catalogue..." />
        ) : error ? (
          <div className="p-8 bg-[#FFDAD6]/30 border border-[#BA1A1A]/30 rounded text-center">
            <p className="text-xs font-semibold text-[#BA1A1A]">{error}</p>
          </div>
        ) : destinations.length === 0 && isFiltered ? (
          /* ── 5. EMPTY SEARCH / FILTER STATE ── */
          <div className="py-16 px-4 bg-white/70 border border-[#DAC2B6]/40 rounded text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#F6F3F2] flex items-center justify-center mx-auto text-[#6C2F00]">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#1C1B1B]">
              No destinations found
            </h4>
            <p className="text-xs sm:text-sm text-[#54433A] max-w-md mx-auto leading-relaxed">
              We couldn't find any places matching{" "}
              {searchQuery ? (
                <strong className="text-[#1C1B1B]">"{searchQuery}"</strong>
              ) : (
                `the selected ${activeZone} filter`
              )}
              . Try checking for spelling or exploring all zones.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-[#6C2F00] text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded hover:bg-[#8B4513] transition-colors cursor-pointer"
              >
                Clear Search & Show All
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
              {(destinations.length > 0
                ? destinations
                : defaultCuratedDestinations
              ).map((dest, idx) => {
                const isLarge = idx % 5 === 0;
                const spanClass = isLarge
                  ? "md:col-span-8 h-[480px]"
                  : "md:col-span-4 h-[480px]";
                const cover =
                  dest.imageUrl ||
                  (dest.images && dest.images[0]) ||
                  "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80";

                return (
                  <Link
                    key={dest._id || dest.name}
                    to={`/destinations/${dest.slug || dest._id}`}
                    className={`relative ${spanClass} overflow-hidden rounded bg-[#1C1B1B] group image-zoom cursor-pointer shadow-sm`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center absolute inset-0 transform transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url("${cover}")` }}
                    />
                    <div className="absolute inset-0 scrim-bottom" />
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                      <h4 className="font-serif text-3xl sm:text-4xl font-bold">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-[#FFB68C] font-semibold uppercase tracking-widest mt-1.5">
                        {dest.state || dest.zone || "India"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ── 6. PAGINATION CONTROLS ── */}
            {totalPages > 1 && (
              <div className="pt-12 border-t border-[#DAC2B6]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-xs text-[#54433A] font-medium">
                  Page <strong className="text-[#1C1B1B]">{currentPage}</strong>{" "}
                  of <strong className="text-[#1C1B1B]">{totalPages}</strong>
                </p>

                <div className="flex items-center space-x-2">
                  {/* Previous Page Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2.5 rounded border border-[#DAC2B6] text-xs font-semibold uppercase tracking-wider text-[#1C1B1B] hover:bg-[#F6F3F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        if (
                          totalPages > 7 &&
                          pageNum !== 1 &&
                          pageNum !== totalPages &&
                          Math.abs(pageNum - currentPage) > 2
                        ) {
                          if (pageNum === 2 || pageNum === totalPages - 1) {
                            return (
                              <span
                                key={pageNum}
                                className="text-xs text-[#877369] px-1"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded text-xs font-semibold transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? "bg-[#6C2F00] text-white shadow-xs font-bold"
                                : "text-[#54433A] hover:bg-[#F6F3F2] hover:text-[#1C1B1B]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  {/* Next Page Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2.5 rounded border border-[#DAC2B6] text-xs font-semibold uppercase tracking-wider text-[#1C1B1B] hover:bg-[#F6F3F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ExplorePage;
