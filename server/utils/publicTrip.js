// Sanitizer for the unauthenticated shared-trip endpoint.
// Only whitelisted display fields may appear in the public response.
// Dedicated sensitive fields — owner references, share tokens, internal
// flags, timestamps, and booking reference/contact fields — are always
// stripped. Free-text display fields (e.g. activity notes) are
// intentionally public; their content is up to the trip owner.

function pickActivity(activity) {
  return {
    name: activity.name,
    date: activity.date,
    location: activity.location,
    notes: activity.notes,
  };
}

function pickAccommodation(accommodation) {
  if (!accommodation) return undefined;

  const publicAccommodation = {
    name: accommodation.name,
    checkIn: accommodation.checkIn,
    checkOut: accommodation.checkOut,
    address: accommodation.address,
  };

  const hasValue = Object.values(publicAccommodation).some(
    (value) => value !== undefined && value !== null,
  );
  return hasValue ? publicAccommodation : undefined;
}

function pickTransportation(transportation) {
  if (!transportation) return undefined;

  // Trip.js declares transportation with Mongoose's `type`-key shorthand
  // ({ type: String, bookingRef: String, ... }), which Mongoose interprets
  // as a plain String path — so persisted values are strings in practice.
  // Object-shaped values are handled too so booking references are
  // stripped whichever shape arrives.
  if (typeof transportation === "string") {
    return { type: transportation };
  }

  const publicTransportation = {
    type: transportation.type,
    departureTime: transportation.departureTime,
    arrivalTime: transportation.arrivalTime,
  };

  const hasValue = Object.values(publicTransportation).some(
    (value) => value !== undefined && value !== null,
  );
  return hasValue ? publicTransportation : undefined;
}

function buildPublicTripResponse(trip) {
  return {
    destination: trip.destination,
    images: trip.images || [],
    startDate: trip.startDate,
    endDate: trip.endDate,
    description: trip.description,
    budget: trip.budget,
    activities: (trip.activities || []).map(pickActivity),
    accommodation: pickAccommodation(trip.accommodation),
    transportation: pickTransportation(trip.transportation),
  };
}

module.exports = { buildPublicTripResponse };
