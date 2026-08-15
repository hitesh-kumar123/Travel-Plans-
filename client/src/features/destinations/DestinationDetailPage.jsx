import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { destinationsApi } from "../../services/api/destinationsApi";
import { useAuth } from "../../context/AuthContext";
import CreateTripModal from "../trips/CreateTripModal";
import { ChevronRight, ArrowRight, MapPin } from "lucide-react";

export const DestinationDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      try {
        const res = await destinationsApi.getById(id);
        const data = res.data?.data || res.data;
        setDestination(data);
      } catch (err) {
        console.warn("Destination fetch error:", err);
        // Fallback default for Udaipur matching Stitch screen
        setDestination({
          _id: "udaipur",
          name: "Udaipur",
          state: "Rajasthan",
          zone: "North India",
          tagline:
            "City of Lakes, where Rajput era palaces meet shimmering waters in the Venice of the East.",
          description:
            "Founded in 1559 by Maharana Udai Singh II, Udaipur is a mesmerizing blend of water, green hills, and white marble palaces. It is often regarded as the most romantic city in India.\n\nThe city centers around a series of artificial lakes, most notably Lake Pichola, where the Lake Palace floats seemingly suspended in time. Beyond the royal residences, the narrow alleys of the old city offer a vibrant tapestry of traditional crafts, rooftop dining, and ancient temples.",
          bestSeason: "October to March",
          idealFor: "Heritage, Culture, Relaxation",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const handlePlanClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/destinations/${id}` } });
    } else {
      setIsPlanModalOpen(true);
    }
  };

  const name = destination?.name || "Udaipur";
  const state = destination?.state || "Rajasthan";
  const tagline =
    destination?.tagline ||
    "City of Lakes, where Rajput era palaces meet shimmering waters in the Venice of the East.";

  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] min-h-screen">
      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section className="relative h-[88vh] min-h-[620px] w-full flex items-end pb-20 px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="bg-cover bg-center w-full h-full transform scale-100 transition-transform duration-1000"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOV-43zz_fQSzOafoR51SfV6I1RqXMZrQ9icbYKqE4SJaT1NdNcl592jB75eI1FhdJqpXK4381iSvJPz4IzqkdDkfp2W0AVrZwun8aWE1lEKtwH0mlY-VS_mCcb2Pz9rUudIBcRy-zMCBYwcldOspXp_9Jl9vPVlFpsK8EA25kXgGm8qiMcV9cxlO_SboqBFWGjW2NhXms4uFwQ9F9FUc1DnL37nRoyZaLglXwpSzX43qhtt7bQTR07g")`,
            }}
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 scrim-bottom" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto text-white space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#FFB68C] opacity-90">
            <Link to="/explore" className="hover:underline">
              Explore
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Destinations</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{name}</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-sm">
            {name}
          </h1>
          <p className="text-base sm:text-xl text-[#FCF9F8]/90 max-w-2xl font-normal leading-relaxed">
            {tagline}
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={handlePlanClick}
              className="bg-[#FCF9F8] text-[#1C1B1B] px-8 py-4 text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#F0EDED] hover:-translate-y-0.5 transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>Plan This Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. DISCOVER UDAIPUR / STORY SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-7 image-container overflow-hidden rounded relative h-[420px] sm:h-[500px] shadow-sm bg-[#F0EDED]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS4TQ6qAwzzUs-3LpEi4UA4JlL3aoWLvbxiuTHc-d3TwgOw1u0dzuO6eNA1COg4EivZzclmMdYH242ndEXifj4mV90gTvspLFLXXp3yFT8K17dNnJkJiq4ESuygW39Or7hOP0UVazVB21jg-cJqKeXpdaQVRI8wfixu-oXfTPCmD_U52svn-eyBCG0pyXjIjfPQ1WFW-EZ3FA-eH4vcchCbMvTEDQ5mO-ADaUnEsepf2OzhU7IARxXUQ"
              alt="Rajasthani Balcony overlooking Lake"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="md:col-span-5 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] block">
              HERITAGE SANCTUARY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B]">
              Venice of the East
            </h2>
            <p className="text-sm sm:text-base text-[#54433A] leading-relaxed">
              Founded in 1559 by Maharana Udai Singh II, Udaipur is a
              mesmerizing blend of water, green hills, and white marble palaces.
              It is often regarded as the most romantic city in India.
            </p>
            <p className="text-sm sm:text-base text-[#54433A] leading-relaxed">
              The city centers around a series of artificial lakes, most notably
              Lake Pichola, where the Lake Palace floats seemingly suspended in
              time. Beyond royal residences, the narrow alleys offer a vibrant
              tapestry of traditional crafts, rooftop dining, and ancient
              temples.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. INFO STRIP ── */}
      <section className="border-y border-[#DAC2B6]/40 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#DAC2B6]/30">
            <div className="px-6 first:pt-0 pt-6 md:pt-0 flex flex-col items-center md:items-start">
              <span className="text-xs font-semibold text-[#877369] uppercase tracking-widest mb-2">
                Best Season
              </span>
              <span className="font-serif text-xl font-bold text-[#1C1B1B]">
                October to March
              </span>
            </div>

            <div className="px-6 pt-6 md:pt-0 flex flex-col items-center md:items-start">
              <span className="text-xs font-semibold text-[#877369] uppercase tracking-widest mb-2">
                Region
              </span>
              <span className="font-serif text-xl font-bold text-[#1C1B1B]">
                {state}, India
              </span>
            </div>

            <div className="px-6 pt-6 md:pt-0 flex flex-col items-center md:items-start">
              <span className="text-xs font-semibold text-[#877369] uppercase tracking-widest mb-2">
                Ideal For
              </span>
              <span className="font-serif text-xl font-bold text-[#1C1B1B]">
                Heritage, Culture, Relaxation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. KEY LANDMARKS ASYMMETRIC GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 sm:py-32 space-y-12">
        <div className="flex justify-between items-end pb-6 border-b border-[#DAC2B6]/40">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] block mb-1">
              CURATED ATTRACTIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B]">
              Key Landmarks
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: City Palace (8 Cols) */}
          <div className="md:col-span-8 group cursor-pointer relative h-[480px] overflow-hidden rounded bg-[#1C1B1B] image-zoom shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDULAsiHJOHLmXQFHX3UmbIEQT1Rh96Atnyl_2MB-t8dbq7j3N3thwTobaf65Mg_dZh8LJmORs6xT4L2Js2ay5XvPAUQPwRFq4cvP6-mbVk66a2isBKLXiVni_GPqukxBCtITZaW82tDs4CobqPB9sm4lY6g6WXUW-AyTmhHHDhcpJ7aR1fpmflTG1YuhHW7wstQMH_Bv-qPFr5J1LO960ADNVmSg0pACgKFneQvGkdpeTsgGOvKwhNxw"
              alt="City Palace Udaipur"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-8 text-white space-y-2">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold">
                City Palace
              </h3>
              <p className="text-sm text-[#FCF9F8]/90 max-w-md leading-relaxed">
                Rajasthan's largest palace complex, towering over Lake Pichola
                with majestic courtyards and pavilions.
              </p>
            </div>
          </div>

          {/* Card 2: Lake Pichola (4 Cols) */}
          <div className="md:col-span-4 group cursor-pointer relative h-[480px] overflow-hidden rounded bg-[#1C1B1B] image-zoom shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBihFCEF3JvBSeGoFT2bSw09d8mGtKcs_OuW_hx-H1erZgaddWRzKSzd11BUYf8x7n2RuKwSW7ofrpxke5v6yjaTXaOYH6uQ4udxme90BwypeLlHF38arSX-ysuDETmZHSbOiaFHzDJJ7FWu6O77xq_gvuMdV5N2IlbmIHx7A7Wpi2I9_p7c2KE3Ds573MN7cMxWGvaqrkcDMQj5uCS6lHXfFRp_82bha9jRtBVdipId03lwc2jKMIFHQ"
              alt="Lake Pichola"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-8 text-white space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Lake Pichola
              </h3>
              <p className="text-sm text-[#FCF9F8]/90 leading-relaxed">
                The soul of Udaipur, an artificial freshwater lake established
                in 1362.
              </p>
            </div>
          </div>

          {/* Card 3: Sajjangarh Palace (6 Cols) */}
          <div className="md:col-span-6 group cursor-pointer relative h-[380px] overflow-hidden rounded bg-[#1C1B1B] image-zoom shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClzrnZJQHNzyk8vaq33c8_ZJE8Z-6CDmFqU1ySQVv6n98N-Z5kDPAVbH9gmpkPbY-Bb1LIWYnWp7d3WR4as3XSRcPPF690NGpTEBC_9Dhv5NaKeOyCvVEa4fZ1avk_U8v66o6chRNdB68j8Irmx9M1KBT7pYZqbd5VXr-h1PcBURU8YfwsCVVkNmHTYtq33FDI6VkcrMt8Cu9JwhD6q3fs-VWkaRdLeqG-9LF1NKF4FQk-CWuFZ59okA"
              alt="Sajjangarh Monsoon Palace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white space-y-1.5">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Sajjangarh Palace
              </h3>
              <p className="text-sm text-[#FCF9F8]/90 leading-relaxed">
                The Monsoon Palace, offering panoramic views of the city's
                lakes.
              </p>
            </div>
          </div>

          {/* Card 4: Jagdish Temple (6 Cols) */}
          <div className="md:col-span-6 group cursor-pointer relative h-[380px] overflow-hidden rounded bg-[#1C1B1B] image-zoom shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX_jn5V6JRrqIKW1WTByfWtH87pdi05xr68Zdy8GXuzfaWIfbxVHprlo97_CtlL5_vtwiVG6sxcdAETcfbU6ZzVwMX61lLTq9ceCVI23dsOwzjyZsFDftWECscr8AI4JajgZxoZ1NCh_ABsUUmcxL9YZvt3vNfuD4VydMhwh75i8MHwuju-58goEHR_BMlo-d_KIS9vzW_Og2YdsimUKeLvG9QClXGrQPDG8eP4mf2hxutlvWEYQpgLw"
              alt="Jagdish Temple"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scrim-bottom opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white space-y-1.5">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Jagdish Temple
              </h3>
              <p className="text-sm text-[#FCF9F8]/90 leading-relaxed">
                A magnificent example of Indo-Aryan architecture in the heart of
                the old city.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FINAL CTA SECTION ── */}
      <section className="bg-[#F6F3F2] py-24 sm:py-32 px-4 sm:px-8 border-t border-[#DAC2B6]/30 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#1C1B1B]">
            Ready to make {name} your next journey?
          </h2>
          <p className="text-base text-[#54433A] leading-relaxed">
            Discover the romance of {name} with an intentional, curated
            itinerary.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePlanClick}
              className="bg-[#1C1B1B] text-white px-10 py-4 text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#6C2F00] transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>Plan This Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Plan Journey Modal */}
      {isPlanModalOpen && (
        <CreateTripModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          initialDestination={name}
          onTripCreated={(newTrip) => {
            setIsPlanModalOpen(false);
            navigate(`/trips/${newTrip._id}`);
          }}
        />
      )}
    </div>
  );
};

export default DestinationDetailPage;
