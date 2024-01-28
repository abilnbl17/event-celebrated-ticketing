import { useState } from 'react';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = () => {
    const feedbackData = {
      rating,
      feedback,
    };

    onSubmit(feedbackData);
  };

  return (
    <div className={`modal ${isOpen ? 'flex' : 'hidden'}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="text-xl font-semibold">Give Feedback</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-content">
          <div className="flex items-center mb-4">
            <p className="mr-4">Rating:</p>
            {/* Tampilan bintang */}
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-button ${star <= rating ? 'filled' : ''}`}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </button>
            ))}
          </div>
          <div className="mb-4">
            <p>Feedback:</p>
            {/* Input untuk feedback */}
            <textarea
              className="textarea"
              value={feedback}
              onChange={handleFeedbackChange}
            />
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
