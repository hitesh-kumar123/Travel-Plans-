import { useEffect, useState } from "react";

const CityCarousel = ({ cities, onSelect }) => {
  const [currentCity, setCurrentCity] = useState(0);

  useEffect(() => {
    if (!cities || cities.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCity((prev) => (prev + 1) % cities.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [cities]);

  if (!cities || cities.length === 0) return null;

  const city = cities[currentCity];

  console.log(city.attractions[0].images);
  console.log(city.attractions[0].images?.[0]);

  return (
    <div>
      <div className="city-carousel-header">
        <h2>{city.city}</h2>
        <p>{city.attractions.length} Attractions</p>
      </div>

      <div className="city-carousel-grid">
        {city.attractions.slice(0, 4).map((destination) => (
          <div
            key={destination._id}
            className="wander-dest-card"
            onClick={() => onSelect(destination)}
          >
            <div className="wander-dest-card-img">
              <img
                src={destination.images?.[0]}
                alt={destination.name}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div className="wander-dest-overlay" />

              <div className="wander-dest-info">
                <div className="wander-dest-name">{destination.name}</div>

                <div className="wander-dest-country">
                  {destination.city}, {destination.state}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityCarousel;
