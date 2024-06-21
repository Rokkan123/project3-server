import express from "express";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Stratagem from "../models/stratagem.model.js";
import isAuth from "../middleware/authentication.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
const router = express.Router();

//create review
router.post("/:stratagemId", isAuth, isAdmin, async (req, res) => {
  try {
    const { stratagemId } = req.params;
    const { title, review, rating } = req.body;

    const createdReview = await Review.create({
      title,
      review,
      rating,
      stratagem: stratagemId,
      creator: req.user._id,
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { reviews: createdReview._id } },
      { new: true }
    );

    await Stratagem.findByIdAndUpdate(
      stratagemId,
      { $push: { reviews: createdReview._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "review created succesfully", createdReview });
  } catch (error) {
    console.log("error while creating a review", error);
    res.status(500).json(error);
  }
});
// update review
router.patch("/edit/:reviewId", isAuth, isAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });
    const body = { ...req.body };

    const updatedReview = await Review.findOneAndUpdate(
      { _id: review._id },
      { ...body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

//delete review
router.delete("/:reviewId", isAuth, isAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (review.creator.toString() !== req.user._id) {
      return res.status(401).json({ message: "You can't delete this review" });
    }

    await Stratagem.findByIdAndUpdate(review.stratagem, {
      $pull: { reviews: review._id },
    });
    await User.findByIdAndUpdate(review.creator, {
      $pull: { reviews: review._id },
    });

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Your review was deleted succesfully" });
  } catch (error) {
    console.log("error while deleting review", error);
    res.status(500).json(error);
  }
});
router.patch("/like/:reviewId", isAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId });

    if (review.likes.includes(req.user._id)) {
      const unLike = await Review.findOneAndUpdate(
        { _id: reviewId },
        { $pull: { likes: req.user._id } },
        { new: true, runValidators: true }
      );
      return res.status(200).json(unLike);
    }

    const likeReview = await Review.findOneAndUpdate(
      { _id: reviewId },
      { $push: { likes: req.user._id } },
      { new: true, runValidators: true }
    );

    return res.status(200).json(likeReview);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export default router;
