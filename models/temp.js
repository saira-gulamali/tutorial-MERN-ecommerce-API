const reviewTotals = [
  {
    $match: {
      product: ObjectId("66914d76c3b3acfbfe9e1f80"),
    },
  },
  {
    $group: {
      _id: "$product",
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];

// here we are grouping by rating
const ratingTotals = [
  {
    $match: {
      product: ObjectId("66914d76c3b3acfbfe9e1f80"),
    },
  },
  {
    $group: {
      _id: "$rating",
      count: { $sum: 1 },
    },
  },
];
