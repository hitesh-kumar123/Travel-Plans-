import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { tripsApi } from "../../services/api/tripsApi";
import CreateTripModal from "./CreateTripModal";
import LoadingState from "../../components/LoadingState";
import { ArrowRight, Plus, MapPin, Calendar } from "lucide-react";

export const MyJourneyPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripsApi.getAll({ page: 1, limit: 50 });
      if (res.data?.data) {
        setTrips(res.data.data);
      } else if (Array.isArray(res.data)) {
        setTrips(res.data);
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to retrieve your journey records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleTripCreated = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const filteredTrips = trips.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  const upcomingTrip =
    trips.find((t) => t.status === "planned" || t.status === "ongoing") ||
    trips[0];

  const pastTrips = trips.filter((t) => t._id !== upcomingTrip?._id);

  // Stitch Default Placeholder Past Journeys for Rich Experience if user has fewer trips
  const defaultPastJourneys = [
    {
      _id: "demo-jaipur",
      destination: "Jaipur",
      dateLabel: "Oct 2025 | Completed",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCop9_SUGmoIs8xdYJa5NPHUgJmnmEwh8ERGIz_QNasOM6UHaTVahV3K1wOz6L2u3SROQd2UPS_fZc2TPnz--AyMWSxPG3woCr7fU38exkAkmaezXjYNk2YBb0bxobTclTFcMeHWXppUx_SQlXzc2IEessiDKzephcx0bQRv1USw3ih39tNNKcSoCLdcqwM7m2tea60cEEaxzQhlWEjJQbkRuWRMlgXFeapJ_dr19cRKIzOMkYHwZ_XHQ",
      spanClass: "md:col-span-7 aspect-square",
    },
    {
      _id: "demo-goa",
      destination: "Goa",
      dateLabel: "Dec 2024 | Completed",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDyGZCCvghXSWdIxVaevzBGf8KlCybaCeZfNyAlyQDmMLFWFc4BR0IzirEpCDMGgyhr-mi1CQw5SXk-B07gyA9ITXW6Wouj5fe4yapvsVfKw2srcmH3uVeX0HGG_gLA8IkvMNocPTtngjdg2sAqyqfaQvAiAxgudYICwI0Uh7jwHol91QtIaxYvC2gtVqdvaiVThfqTVFOvTFxoiRmCBJTfE4SdW-GG-J941oAsZrJWMOzxqh7B5WbE-w",
      spanClass: "md:col-span-5 aspect-[3/4] md:aspect-auto md:h-full md:mt-24",
    },
    {
      _id: "demo-kerala",
      destination: "Kerala",
      dateLabel: "Jan 2024 | Completed",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYC5DfuwRa0_Zyydy072tLcyVWtKY34LduwzawRsxmJwk7nbj4XD8va8ofH3xJVIv5HyIz3TuWQzsLcA0ajTW56DiQT8LRoIPYn-YJwugjVaPMR7o7JQG5yyX6GB--fUA3LZYzSYSm-QiLE6VlcVV0RmxIaojqvwUi7BiB4TQ42pfW1zrLO2JvPgextoQ-N2E-vto2gY1lesebHAPBCnN54afLIH9SZwwQw45hq3GEYyrgt9r0rfb0YQ",
      spanClass: "md:col-span-8 aspect-video md:aspect-[16/9] md:-mt-12 z-10",
    },
    {
      _id: "demo-varanasi",
      destination: "Varanasi",
      dateLabel: "Nov 2023 | Completed",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPHB5fKZtlks1MDfVe3TfRskbijreFZnQX-6FjcBJKjQ_QDwTohmzREJAUEx6_R-4wC24p_1CNC8FShNQF8ocTvRIK2DirmZJxb1pqc4opO0xp-jAUk3MCbfSAbE397n0FO5Gn5iy0ePCu71HfUWwK19pkJxJBwrMnuvE6LF5MkNQ_ayeybUJImVnYiOfHZpcqny0X0x0CGJ9OrEi7y7lZDoy4juOS-8SYYUZ47El0RwjIuagTvDJ8WQ",
      spanClass: "md:col-span-4 aspect-square md:aspect-[3/4] md:mt-24",
    },
  ];

  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] min-h-screen pt-32 pb-32">
      {/* ── 1. HEADER SECTION ── */}
      <header className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#DAC2B6]/30 pb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] block mb-2">
              PERSONAL EXPEDITIONS
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#6C2F00]">
              My Journey
            </h1>
            <p className="text-sm sm:text-base text-[#54433A] mt-2">
              Your trips, your places, your stories.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start md:self-auto bg-[#1C1B1B] text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded hover:bg-[#6C2F00] transition-colors duration-300 shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Plan a New Trip</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-8 mt-8 overflow-x-auto pb-3 hide-scrollbar border-b border-[#DAC2B6]/20">
          {[
            { id: "all", label: "All" },
            { id: "planned", label: "Upcoming" },
            { id: "ongoing", label: "Ongoing" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`text-xs font-semibold uppercase tracking-widest pb-3 -mb-[14px] transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? "text-[#6C2F00] border-b-2 border-[#6C2F00]"
                  : "text-[#54433A] hover:text-[#6C2F00]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── 2. FEATURED UPCOMING TRIP ── */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mb-24">
          <LoadingState message="Unpacking your journey archives..." />
        </div>
      ) : upcomingTrip ? (
        <section className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto mb-24">
          <div
            onClick={() => navigate(`/trips/${upcomingTrip._id}`)}
            className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded overflow-hidden group cursor-pointer shadow-sm bg-[#1C1B1B]"
          >
            <img
              alt={upcomingTrip.destination}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              src={
                upcomingTrip.destinationImageUrl ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCPK7Kb014ApSbqJiWUFvuGCH4yM7yCOpPNisGK8_FTjqE1hssMdn34_nB412kz_X3WHnEFvMbz5T6r2SOz_lfv5m7YrXvf5Xgmrqm9f1zNPTvgPj2J6JpEbC5kx0payiVFuEXDlXDb1uH_zlzQHOciJF4rSHIWK0Lbh6-rMGSleYJr9sIXrFl3fNlVaS_qTQI8Ft0FEZkApiwAhVemWiN6K0vp9y38nnXRfjU_t0Z0LRVhtrdmtXK3dA"
              }
            />
            <div className="absolute inset-0 scrim-bottom" />
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 text-white">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded text-[11px] font-semibold uppercase tracking-widest text-white border border-white/30">
                    {upcomingTrip.status || "Upcoming"}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
                    {upcomingTrip.startDate
                      ? `${new Date(upcomingTrip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} — ${new Date(upcomingTrip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`
                      : "Dates not set"}
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
                  {upcomingTrip.destination}
                </h2>
                <p className="text-sm sm:text-base opacity-90 mt-1">India</p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all duration-300 group-hover:translate-x-1"
              >
                <span>View Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto mb-24 text-center py-16 bg-white/50 border border-[#DAC2B6]/30 rounded">
          <h3 className="font-serif text-2xl font-bold text-[#1C1B1B] mb-2">
            No Journeys Planned Yet
          </h3>
          <p className="text-sm text-[#54433A] mb-6">
            Embark on your next expedition across India by defining your
            destination, dates, and budget.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#6C2F00] text-white px-8 py-3.5 rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#8B4513] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Chart Your First Journey</span>
          </button>
        </section>
      )}

      {/* ── 3. PAST JOURNEYS ASYMMETRICAL GRID ── */}
      <section className="px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#6C2F00] mb-12 border-b border-[#DAC2B6]/30 pb-4">
          Past Journeys
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {pastTrips.length > 0
            ? pastTrips.map((trip, idx) => {
                const isLarge = idx % 3 === 0;
                const span = isLarge
                  ? "md:col-span-7 aspect-square"
                  : "md:col-span-5 aspect-[4/3]";
                return (
                  <div
                    key={trip._id}
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    className={`${span} relative rounded overflow-hidden group cursor-pointer bg-[#1C1B1B] shadow-sm`}
                  >
                    <img
                      alt={trip.destination}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={
                        trip.destinationImageUrl ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCop9_SUGmoIs8xdYJa5NPHUgJmnmEwh8ERGIz_QNasOM6UHaTVahV3K1wOz6L2u3SROQd2UPS_fZc2TPnz--AyMWSxPG3woCr7fU38exkAkmaezXjYNk2YBb0bxobTclTFcMeHWXppUx_SQlXzc2IEessiDKzephcx0bQRv1USw3ih39tNNKcSoCLdcqwM7m2tea60cEEaxzQhlWEjJQbkRuWRMlgXFeapJ_dr19cRKIzOMkYHwZ_XHQ"
                      }
                    />
                    <div className="absolute inset-0 scrim-bottom opacity-80" />
                    <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                      <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-2">
                        {trip.status || "Completed"}
                      </p>
                      <h4 className="font-serif text-3xl font-bold">
                        {trip.destination}
                      </h4>
                    </div>
                  </div>
                );
              })
            : defaultPastJourneys.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setIsCreateModalOpen(true)}
                  className={`${item.spanClass} relative rounded overflow-hidden group cursor-pointer bg-[#1C1B1B] shadow-sm`}
                >
                  <img
                    alt={item.destination}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={item.imageUrl}
                  />
                  <div className="absolute inset-0 scrim-bottom opacity-80" />
                  <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                    <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-2">
                      {item.dateLabel}
                    </p>
                    <h4 className="font-serif text-3xl font-bold">
                      {item.destination}
                    </h4>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Create Journey Modal */}
      {isCreateModalOpen && (
        <CreateTripModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTripCreated={handleTripCreated}
        />
      )}
    </div>
  );
};

export default MyJourneyPage;
