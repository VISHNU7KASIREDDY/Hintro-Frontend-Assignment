import { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import './FeedbackModal.css';

export default function FeedbackModal({ isOpen, onClose, onFeedbackAdded }) {
  const [step, setStep] = useState(1); 
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!description) {
      alert('Please describe your experience.');
      return;
    }
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    const now = new Date();
    
    
    const newFeedback = {
      id: Math.random().toString(36).substring(2, 9),
      title: title || description.substring(0, 50),
      rating: rating,
      description: description,
      followUp: followUp,
      date: formatDate(now),
      time: formatTime(now)
    };

    
    try {
      const existing = localStorage.getItem('hintro_feedbacks');
      const feedbacks = existing ? JSON.parse(existing) : [];
      feedbacks.unshift(newFeedback);
      localStorage.setItem('hintro_feedbacks', JSON.stringify(feedbacks));
      
      if (onFeedbackAdded) {
        onFeedbackAdded();
      }

      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#818cf8', '#60a5fa', '#34d399']
      });

      setStep(3);
    } catch (err) {
      console.error('Failed to save feedback to localStorage:', err);
      alert('Failed to save feedback. Please try again.');
    }
  };

  const handleClose = () => {
    setStep(1);
    setTitle('');
    setRating(0);
    setDescription('');
    setFollowUp('');
    onClose();
  };

  
  const getFollowUpQuestion = () => {
    if (rating >= 4) {
      return 'What did you like the most?';
    }
    return 'What frustrated you or felt confusing?';
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={handleClose}>
      <div 
        className="modal-card glass animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {step < 3 && (
          <div className="step-indicator">
            <div className={`step-dot ${step === 1 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step === 2 ? 'active' : ''}`}></div>
          </div>
        )}

        {step === 1 && (
          <>
            <h2 className="modal-title">Give Feedback</h2>
            
            <form className="modal-form" onSubmit={handleNextStep}>
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-desc">Describe your experience using Hintro…</label>
                <textarea
                  id="feedback-desc"
                  placeholder="Share details about what worked well or what needs improvement..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="rating-group">
                <span className="form-label">How would you rate Hintro?</span>
                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <Star size={28} fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Next
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="modal-title">{getFollowUpQuestion()}</h2>
            
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea
                  id="followup-desc"
                  placeholder={rating >= 4 ? "Tell us what features or options wowed you..." : "Help us understand where we fell short..."}
                  rows={5}
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <div className="thanks-screen animate-scale-in">
            <div className="success-icon-wrapper">
              <CheckCircle size={36} />
            </div>
            <h2 className="thanks-title">Thank you for your feedback!!</h2>
            <p className="thanks-desc">
              Our team reviews every suggestion to improve AI responses, workflows, and overall experience.
            </p>
            <button className="btn-primary" style={{ padding: '12px 30px', marginTop: '10px' }} onClick={handleClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// temporary star rating validation
