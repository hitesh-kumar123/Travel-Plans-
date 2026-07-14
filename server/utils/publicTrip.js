// Sanitizer for the unauthenticated shared-trip endpoint.
// Only whitelisted display fields may appear in the public response —
// owner references, share tokens, internal flags, timestamps, and
// booking/contact details must never be exposed here.

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

  // The Trip schema stores transportation as a plain string (the mode of
  // transport), but guard against object-shaped values so booking
  // references are stripped in either case.
  if (typeof transportation === "string") {
    return { type: transportation };
  }

  return {
    type: transportation.type,
    departureTime: transportation.departureTime,
    arrivalTime: transportation.arrivalTime,
  };
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
