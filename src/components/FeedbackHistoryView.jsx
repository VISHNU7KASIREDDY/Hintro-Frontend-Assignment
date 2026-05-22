import { Play, Star } from 'lucide-react';
import './FeedbackHistoryView.css';

export default function FeedbackHistoryView({ feedbacks, onOpenFeedback }) {
  
  const renderStars = (rating) => {
    return (
      <div className="feedback-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={12} 
            className={star <= rating ? "star-active-icon" : "star-muted-icon"}
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="feedback-history-container animate-fade-in">
      <div className="feedback-header-box">
        <div>
          <h1 className="feedback-history-title">Feedback History</h1>
          <p className="feedback-history-subtitle">Browse your previous feedback submissions</p>
        </div>
        
        <div className="feedback-header-actions">
          <button 
            className="btn-watch-tutorial" 
            onClick={() => alert('Opening feedback tutorial overlay video...')}
            style={{ marginRight: '12px' }}
          >
            <span className="play-icon">
              <Play size={10} fill="currentColor" />
            </span>
            <span>Watch Tutorial</span>
          </button>
          
          <button 
            className="btn-start-call" 
            onClick={onOpenFeedback}
          >
            Give Feedback
          </button>
        </div>
      </div>

      {feedbacks && feedbacks.length > 0 ? (
        <>
          
          <div className="feedback-desktop-view">
            <div className="feedback-table-card">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Rating</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((item) => (
                    <tr key={item.id}>
                      <td className="feedback-td-title">{item.title || "My First Call"}</td>
                      <td className="feedback-td-rating">{item.rating}/5</td>
                      <td className="feedback-td-desc">
                        <div className="desc-bullet-item">
                          - {item.description}
                        </div>
                        {item.followUp && (
                          <div className="desc-bullet-item followup-bullet">
                            - {item.followUp}
                          </div>
                        )}
                      </td>
                      <td className="feedback-td-date">{item.date}</td>
                      <td className="feedback-td-time">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          
          <div className="feedback-mobile-view">
            <div className="feedback-cards-list">
              {feedbacks.map((item) => (
                <div key={item.id} className="feedback-history-card">
                  <div className="feedback-card-header">
                    <span className="feedback-card-title">{item.title || "Feedback Title"}</span>
                    {renderStars(item.rating)}
                  </div>
                  <div className="feedback-card-body">
                    <p className="feedback-desc-text">{item.description}</p>
                    {item.followUp && (
                      <div className="feedback-card-followup">
                        <span className="followup-label">Follow-up:</span>
                        <p className="followup-text">{item.followUp}</p>
                      </div>
                    )}
                  </div>
                  <div className="feedback-card-footer">
                    <span>{item.date} • {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        
        <div className="feedback-empty-state-card animate-scale-in">
          
          <div className="feedback-desktop-view" style={{ width: '100%' }}>
            <div className="feedback-table-card empty-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Rating</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
              </table>
              <div className="empty-table-body">
                <span className="empty-message-text">No feedbacks yet</span>
                <button className="btn-start-call" onClick={onOpenFeedback} style={{ marginTop: '16px' }}>
                  Give Feedback
                </button>
              </div>
            </div>
          </div>

          
          <div className="feedback-mobile-view" style={{ width: '100%' }}>
            <div className="feedback-mobile-empty">
              <span className="empty-message-text">No feedbacks yet</span>
              <button className="btn-start-call" onClick={onOpenFeedback} style={{ marginTop: '16px', width: '100%' }}>
                Give Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
