import Trip from '../models/Trip';

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
};

export default getTrips;