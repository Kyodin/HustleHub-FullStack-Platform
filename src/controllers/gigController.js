const Gig = require("../models/Gig");
const { validationResult } = require("express-validator");

// CREATE GIG
const createGig = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const gig = await Gig.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      isAvailable: req.body.isAvailable ?? true,
      freelancer: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Gig created successfully",
      gig,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL AVAILABLE GIGS
const getGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ isAvailable: true })
      .populate("freelancer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    next(error);
  }
};

// GET FREELANCER'S OWN GIGS
const getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({
      freelancer: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE GIG
const getGigById = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "freelancer",
      "name email"
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    return res.status(200).json({
      success: true,
      gig,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE OWN GIG
const updateGig = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    if (gig.freelancer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own gigs",
      });
    }

    gig.title = req.body.title;
    gig.description = req.body.description;
    gig.category = req.body.category;
    gig.price = req.body.price;

    if (req.body.isAvailable !== undefined) {
      gig.isAvailable = req.body.isAvailable;
    }

    await gig.save();

    return res.status(200).json({
      success: true,
      message: "Gig updated successfully",
      gig,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE OWN GIG
const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    if (gig.freelancer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own gigs",
      });
    }

    await gig.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Gig deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGig,
  getGigs,
  getMyGigs,
  getGigById,
  updateGig,
  deleteGig,
};