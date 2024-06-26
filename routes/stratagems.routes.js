import express from "express";
import isAuth from "../middleware/authentication.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import Stratagem from "../models/stratagem.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";

const router = express.Router();

//create
router.post("/", isAuth, isAdmin, async (req, res) => {
  try {
    const {
      name,
      code,
      damage,
      cooldown,
      amount,
      uses,
      description,
      rank,
      cost,
      image,
      penetration,
    } = req.body;
    const stratagemData = {
      name,
      code,
      damage,
      cooldown,
      amount,
      uses,
      description,
      rank,
      cost,
      image,
      penetration,
    };
    for (const property in stratagemData) {
      if (!stratagemData[property]) {
        delete stratagemData.property;
      }
    }

    const stratagem = await Stratagem.create(stratagemData);

    res
      .status(201)
      .json({ message: "Stratagem created succesfuly", stratagem });
  } catch (error) {
    console.log("error creating stratagem", error);
    res.status(500).json(error);
  }
});

//get all stratagems
router.get("/all", async (req, res) => {
  try {
    const allStratagems = await Stratagem.find().populate({
      path: "reviews",
      populate: { path: "creator" },
    });
    console.log(allStratagems[0]);
    res.json(allStratagems);
  } catch (error) {
    console.log("error fetching all stratagems", error);
    res.status(500).json(error);
  }
});

//get a single stratagem
router.get("/:stratagemId", async (req, res) => {
  try {
    const { stratagemId } = req.params;

    const singleStratagem = await Stratagem.findById(stratagemId).populate({
      path: "reviews",
      populate: { path: "creator" },
    });

    res.json(singleStratagem);
  } catch (error) {
    console.log("error fetching details single stratagem", singleStratagem);
  }
});

//edit stratagem
router.put("/:stratagemId", isAuth, isAdmin, async (req, res) => {
  try {
    const { stratagemId } = req.params;
    const {
      name,
      code,
      damage,
      cooldown,
      amount,
      uses,
      description,
      rank,
      cost,
      penetration,
    } = req.body;
    const stratagemData = {
      name,
      code,
      damage,
      cooldown,
      amount,
      uses,
      description,
      rank,
      cost,
      penetration,
    };
    for (const property in stratagemData) {
      if (!stratagemData[property]) {
        delete stratagemData.property;
      }
    }

    const updated = await Stratagem.findByIdAndUpdate(
      stratagemId,
      stratagemData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({ message: "Stratagem was updated succesfuly", updated });
  } catch (error) {
    console.log("error editing the stratagem", error);
    res.status(500).json(error);
  }
});

//delete stratagem
router.delete("/:stratagemId", isAuth, isAdmin, async (req, res) => {
  try {
    const { stratagemId } = req.params;
    const stratagem = await Stratagem.findById(stratagemId).populate("reviews");

    for (const review of stratagem.reviews) {
      await User.findByIdAndUpdate(review.creator, {
        $pull: { reviews: review._id },
      });
      await Review.findByIdAndDelete(review._id);
    }

    const deleted = await Stratagem.findByIdAndDelete(stratagemId);

    res.json({
      message: deleted.name + " Stratagem was deleted succesfully",
      deleted,
    });
  } catch (error) {
    console.log("error deleting the stratagem", error);
    res.status(500).json(error);
  }
});

export default router;
