import { useContext, useState } from 'react';
import { AuthContext } from '../App';

function CommentForm({ photoId, onCommentAdded }) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/photos/${photoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, comment })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Could not add comment');
      }

      onCommentAdded(data);
      setComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-light border-0 mt-4">
      <div className="card-body">
        <h3 className="h5 fw-bold mb-3">Add a Comment</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Your Comment</label>
            <textarea
              id="comment"
              className="form-control"
              rows="3"
              maxLength="1000"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentForm;
