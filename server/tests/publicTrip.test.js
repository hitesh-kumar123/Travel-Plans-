const { test } = require("node:test");
const assert = require("node:assert/strict");
const { buildPublicTripResponse } = require("../utils/publicTrip");

const FORBIDDEN_FIELDS = [
  "_id",
  "__v",
  "user",
  "shareToken",
  "shareEnabled",
  "createdAt",
  "updatedAt",
  // internal metadata not rendered by SharedTripView
  "status",
];

function makeTrip(overrides = {}) {
  return {
    _id: "665f1a2b3c4d5e6f7a8b9c0d",
    __v: 0,
    user: "665f1a2b3c4d5e6f7a8b9c0e",
    destination: "Paris",
    images: ["https://example.com/paris.jpg"],
    startDate: new Date("2026-08-01"),
    endDate: new Date("2026-08-10"),
    description: "Summer trip",
    budget: 1500,
    status: "planned",
    activities: [
      {
        _id: "665f1a2b3c4d5e6f7a8b9c0f",
        name: "Louvre visit",
        date: new Date("2026-08-02"),
        location: "Louvre Museum",
        notes: "Book tickets in advance",
      },
    ],
    accommodation: {
      name: "Hotel Lumière",
      bookingRef: "BR-12345",
      checkIn: new Date("2026-08-01"),
      checkOut: new Date("2026-08-10"),
      address: "1 Rue de Rivoli, Paris",
      contactInfo: "+33 1 23 45 67 89",
    },
    transportation: "flight",
    shareToken: "a1b2c3d4e5f6",
    shareEnabled: true,
    createdAt: new Date("2026-07-01"),
    updatedAt: new Date("2026-07-02"),
    ...overrides,
  };
}

test("public response never includes internal or sensitive trip fields", () => {
  const publicTrip = buildPublicTripResponse(makeTrip());

  for (const field of FORBIDDEN_FIELDS) {
    assert.equal(
      field in publicTrip,
      false,
      `public response must not include "${field}"`,
    );
  }
});

test("public response keeps the whitelisted display fields", () => {
  const trip = makeTrip();
  const publicTrip = buildPublicTripResponse(trip);

  assert.equal(publicTrip.destination, "Paris");
  assert.deepEqual(publicTrip.images, trip.images);
  assert.equal(publicTrip.startDate, trip.startDate);
  assert.equal(publicTrip.endDate, trip.endDate);
  assert.equal(publicTrip.description, "Summer trip");
  assert.equal(publicTrip.budget, 1500);
  assert.deepEqual(publicTrip.activities, [
    {
      name: "Louvre visit",
      date: trip.activities[0].date,
      location: "Louvre Museum",
      notes: "Book tickets in advance",
    },
  ]);
});

test("activities are stripped of subdocument ids", () => {
  const publicTrip = buildPublicTripResponse(makeTrip());

  for (const activity of publicTrip.activities) {
    assert.equal("_id" in activity, false);
  }
});

test("accommodation excludes booking reference and contact info", () => {
  const publicTrip = buildPublicTripResponse(makeTrip());

  assert.deepEqual(publicTrip.accommodation, {
    name: "Hotel Lumière",
    checkIn: makeTrip().accommodation.checkIn,
    checkOut: makeTrip().accommodation.checkOut,
    address: "1 Rue de Rivoli, Paris",
  });
  assert.equal("bookingRef" in publicTrip.accommodation, false);
  assert.equal("contactInfo" in publicTrip.accommodation, false);
});

test("string transportation is exposed as its type only", () => {
  const publicTrip = buildPublicTripResponse(
    makeTrip({ transportation: "flight" }),
  );

  assert.deepEqual(publicTrip.transportation, { type: "flight" });
});

test("object transportation is stripped of booking reference", () => {
  const departureTime = new Date("2026-08-01T08:00:00Z");
  const arrivalTime = new Date("2026-08-01T10:00:00Z");
  const publicTrip = buildPublicTripResponse(
    makeTrip({
      transportation: {
        type: "flight",
        bookingRef: "FL-98765",
        departureTime,
        arrivalTime,
      },
    }),
  );

  assert.deepEqual(publicTrip.transportation, {
    type: "flight",
    departureTime,
    arrivalTime,
  });
});

test("handles trips without optional fields", () => {
  const publicTrip = buildPublicTripResponse(
    makeTrip({
      images: undefined,
      activities: undefined,
      accommodation: undefined,
      transportation: undefined,
      description: undefined,
    }),
  );

  assert.deepEqual(publicTrip.images, []);
  assert.deepEqual(publicTrip.activities, []);
  assert.equal(publicTrip.accommodation, undefined);
  assert.equal(publicTrip.transportation, undefined);
});

test("empty accommodation object is omitted", () => {
  const publicTrip = buildPublicTripResponse(makeTrip({ accommodation: {} }));

  assert.equal(publicTrip.accommodation, undefined);
});

test("budget of zero is preserved", () => {
  const publicTrip = buildPublicTripResponse(makeTrip({ budget: 0 }));

  assert.equal(publicTrip.budget, 0);
});
