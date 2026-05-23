const PickupRequest = require('../models/PickupRequest');

// @desc    Request a pickup
// @route   POST /api/pickup/request
// @access  Private
const requestPickup = async (req, res) => {
  const { wasteId, preferredDate, notes, location, coordinates } = req.body;

  try {
    const pickup = new PickupRequest({
      userId: req.user._id,
      wasteId: wasteId || undefined,
      preferredDate,
      notes,
      location,
      coordinates,
    });

    const createdPickup = await pickup.save();
    res.status(201).json(createdPickup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pickup requests (Admin)
// @route   GET /api/pickup/all
// @access  Private/Admin
const getAllPickups = async (req, res) => {
  try {
    const pickups = await PickupRequest.find({})
      .populate('userId', 'name email')
      .populate('wasteId', 'wasteType location');
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's pickup requests
// @route   GET /api/pickup/mypickups
// @access  Private
const getMyPickups = async (req, res) => {
  try {
    const pickups = await PickupRequest.find({ userId: req.user._id })
      .populate('wasteId', 'wasteType location');
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pickup status (Admin)
// @route   PUT /api/pickup/:id/status
// @access  Private/Admin
const updatePickupStatus = async (req, res) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);

    if (pickup) {
      pickup.status = req.body.status || pickup.status;
      const updatedPickup = await pickup.save();
      res.json(updatedPickup);
    } else {
      res.status(404).json({ message: 'Pickup request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { requestPickup, getAllPickups, getMyPickups, updatePickupStatus };
