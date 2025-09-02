import { useState } from "react";

export default function Review() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      rating: 5,
      comment: "Amazing experience! Everything was smooth and fast.",
      date: "2025-09-01",
    },
    {
      id: 2,
      name: "Michael Smith",
      rating: 4,
      comment: "Very good service, but delivery could be a little faster.",
      date: "2025-08-29",
    },
    {
      id: 3,
      name: "Sophia Lee",
      rating: 3,
      comment: "It was okay. Expected a bit more quality for the price.",
      date: "2025-08-27",
    },
    {
      id: 4,
      name: "David Kim",
      rating: 5,
      comment: "Excellent! Will definitely recommend to my friends.",
      date: "2025-08-25",
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const handleChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating <= 0) return;

    const fakeId = reviews.length + 1;
    const today = new Date().toISOString().slice(0, 10);

    setReviews([
      {
        id: fakeId,
        ...newReview,
        date: today,
      },
      ...reviews,
    ]);

    setNewReview({ name: "", rating: 0, comment: "" });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Customer Reviews
      </h2>

      {/* Reviews List */}
      <div className="space-y-4 mb-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {review.name}
              </span>
              <span className="text-yellow-500">
                {"⭐".repeat(review.rating)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {review.comment}
            </p>
            <p className="text-sm text-gray-400 mt-1">{review.date}</p>
          </div>
        ))}
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={newReview.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={handleChange}
          min="1"
          max="5"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
        />
        <textarea
          name="comment"
          placeholder="Write your review..."
          value={newReview.comment}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
