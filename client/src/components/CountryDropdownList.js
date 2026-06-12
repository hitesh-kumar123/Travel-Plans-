import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const CountryDropdownList = ({
  where,
  setWhere,
  destinations,
  setShowRecentSearches,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!where || where.trim() === "") {
      setIsOpen(false);
      setFilteredCountries([]);
      return;
    }

    const query = where.toLowerCase().trim();

    // Comprehensive list of countries, popular cities, and states
    const GLOBAL_DESTINATIONS = [
      // Countries
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
      // UK Regions
      "England",
      "Scotland",
      "Wales",
      "Northern Ireland",
      "Great Britain",
      // US States
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
      // Indian States & UTs
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Lakshadweep",
      "Delhi",
      "Puducherry",
      "Ladakh",
      "Jammu and Kashmir",
      // Canadian Provinces & Australian States
      "Ontario",
      "Quebec",
      "British Columbia",
      "Alberta",
      "Nova Scotia",
      "New South Wales",
      "Victoria",
      "Queensland",
      "Western Australia",
      "South Australia",
      "Tasmania",
      // Major Indian Cities
      "Mumbai",
      "Delhi",
      "Bengaluru",
      "Hyderabad",
      "Ahmedabad",
      "Chennai",
      "Kolkata",
      "Surat",
      "Pune",
      "Jaipur",
      "Lucknow",
      "Kanpur",
      "Nagpur",
      "Indore",
      "Thane",
      "Bhopal",
      "Visakhapatnam",
      "Pimpri-Chinchwad",
      "Patna",
      "Vadodara",
      "Ghaziabad",
      "Ludhiana",
      "Agra",
      "Nashik",
      "Faridabad",
      "Meerut",
      "Rajkot",
      "Kalyan-Dombivli",
      "Vasai-Virar",
      "Varanasi",
      "Srinagar",
      "Aurangabad",
      "Dhanbad",
      "Amritsar",
      "Navi Mumbai",
      "Allahabad",
      "Howrah",
      "Ranchi",
      "Gwalior",
      "Jabalpur",
      "Coimbatore",
      "Vijayawada",
      "Jodhpur",
      "Madurai",
      "Raipur",
      "Kota",
      "Guwahati",
      "Solapur",
      "Hubli-Dharwad",
      "Mysore",
      "Tiruchirappalli",
      "Bareilly",
      "Aligarh",
      "Tiruppur",
      "Moradabad",
      "Jalandhar",
      "Bhubaneswar",
      "Salem",
      "Warangal",
      "Guntur",
      "Bhiwandi",
      "Saharanpur",
      "Gorakhpur",
      "Bikaner",
      "Amravati",
      "Noida",
      "Jamshedpur",
      "Bhilai",
      "Cuttack",
      "Firozabad",
      "Kochi",
      "Bhavnagar",
      "Dehradun",
      "Durgapur",
      "Asansol",
      "Nanded",
      "Kolhapur",
      "Ajmer",
      "Gulbarga",
      "Jamnagar",
      "Ujjain",
      "Loni",
      "Siliguri",
      "Jhansi",
      "Ulhasnagar",
      "Nellore",
      "Jammu",
      "Belgaum",
      "Mangalore",
      "Ambattur",
      "Tirunelveli",
      "Malegaon",
      "Gaya",
      "Jalgaon",
      "Udaipur",
      // Popular World Cities & Destinations
      "London",
      "Paris",
      "Tokyo",
      "Dubai",
      "New York City",
      "Rome",
      "Barcelona",
      "Los Angeles",
      "Sydney",
      "Istanbul",
      "Bali",
      "Santorini",
      "Bora Bora",
      "Phuket",
      "Ibiza",
      "Kyoto",
      "Reykjavik",
      "Venice",
      "Amsterdam",
      "Berlin",
      "Madrid",
      "Prague",
      "Vienna",
      "Las Vegas",
      "Miami",
      "San Francisco",
      "Cancun",
      "Tulum",
      "Punta Cana",
      "Rio de Janeiro",
      "Buenos Aires",
      "Cape Town",
      "Marrakech",
      "Cairo",
      "Seoul",
      "Bangkok",
      "Hong Kong",
      "Shanghai",
      "Beijing",
      "Toronto",
      "Vancouver",
      "Montreal",
      "Banff",
      "Auckland",
      "Queenstown",
    ];

    const matches = GLOBAL_DESTINATIONS.filter((dest) =>
      dest.toLowerCase().includes(query),
    );

    if (matches.length > 0) {
      setFilteredCountries(matches.slice(0, 10));
      setIsOpen(true);
      setShowRecentSearches(false);
    } else {
      setIsOpen(false);
    }
    setFocusedIndex(-1);
  }, [where, setShowRecentSearches]);

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen) {
        const inputEl = document.querySelector(
          ".wander-search-bar input.wander-sf-val",
        );
        if (inputEl) {
          const containerEl = inputEl.closest(".wander-sf");
          if (containerEl) {
            const rect = containerEl.getBoundingClientRect();
            setDropdownStyle({
              position: "absolute",
              top: rect.bottom + window.scrollY + 8 + "px",
              left: rect.left + window.scrollX + "px",
              width: rect.width + "px",
            });
          }
        }
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, filteredCountries]);

  useEffect(() => {
    window.__countryDropdownOnKeyDown = (e) => {
      if (!isOpen || filteredCountries.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % filteredCountries.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex(
          (prev) =>
            (prev - 1 + filteredCountries.length) % filteredCountries.length,
        );
      } else if (e.key === "Enter") {
        if (focusedIndex >= 0 && focusedIndex < filteredCountries.length) {
          e.preventDefault();
          const selected = filteredCountries[focusedIndex];
          setWhere(selected);
          setIsOpen(false);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    return () => {
      delete window.__countryDropdownOnKeyDown;
    };
  }, [isOpen, filteredCountries, focusedIndex, setWhere]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (!e.target.classList.contains("wander-sf-val")) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || filteredCountries.length === 0) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        ...dropdownStyle,
        background: "#ffffff",
        border: "1px solid rgba(26, 74, 107, 0.12)",
        borderRadius: "14px",
        boxShadow: "0 16px 40px rgba(15, 45, 64, 0.14)",
        zIndex: 9999,
        maxHeight: "250px",
        overflowY: "auto",
        padding: "0.5rem 0",
      }}
    >
      {filteredCountries.map((country, idx) => (
        <div
          key={country}
          onMouseDown={() => {
            setWhere(country);
            setIsOpen(false);
          }}
          onMouseEnter={() => setFocusedIndex(idx)}
          style={{
            padding: "0.9rem 1rem",
            cursor: "pointer",
            background:
              focusedIndex === idx ? "rgba(26, 74, 107, 0.05)" : "transparent",
            color: "#1a4a6b",
            fontWeight: 500,
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.95rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {country}
        </div>
      ))}
    </div>,
    document.body,
  );
};

export default CountryDropdownList;
