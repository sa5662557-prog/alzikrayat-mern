import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../App';
import CommentForm from '../components/CommentForm';

const formatDate = (date) =>
  new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

function PhotoDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError('');

    fetch(`/api/photos/${id}`)
      .then((res) => {
        if (res.status === 400 || res.status === 404) {
          throw new Error('Photo not found');
        }
        if (!res.ok) {
          throw new Error('Could not load photo');
        }
        return res.json();
      })
      .then((data) => {
        setPhoto(data);
        return fetch(`/api/photos/${id}/comments`);
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not load comments');
        }
        return res.json();
      })
      .then((data) => setComments(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    setDeleteError('');
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not delete photo');
      }

      navigate('/gallery');
    } catch (err) {
      setDeleteError(err.message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading photo...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/gallery" className="btn btn-outline-secondary">← Back to Gallery</Link>
      </main>
    );
  }

  const isOwner = user && user._id === photo.userId._id;

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <Link to="/gallery" className="btn btn-outline-secondary mb-4">← Back to Gallery</Link>

          <div className="card shadow-sm overflow-hidden">
            <img
              src={`/uploads/${photo.fileName}`}
              className="img-fluid w-100 detail-image"
              alt={photo.title}
            />

            <div className="card-body p-4">
              <h1 className="fw-bold mb-3 text-break">{photo.title}</h1>

              <p className="text-muted mb-2">
                <strong>By:</strong> {photo.userId.firstName} {photo.userId.lastName}
              </p>
              <p className="text-muted mb-4">
                <strong>Date:</strong> {formatDate(photo.dateTime)}
              </p>

              {isOwner && (
                <div className="mb-4">
                  {deleteError && <div className="alert alert-danger">{deleteError}</div>}
                  <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete Photo'}
                  </button>
                </div>
              )}

              {photo.description && (
                <div className="mb-5">
                  <h2 className="h5 fw-bold">Description</h2>
                  <p className="text-muted keep-lines">{photo.description}</p>
                </div>
              )}

              <hr />

              <section className="mt-4">
                <h2 className="h4 fw-bold mb-4">Comments ({comments.length})</h2>

                {comments.length === 0 ? (
                  <div className="alert alert-light border">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between flex-wrap gap-2">
                        <strong>
                          {comment.userId.firstName} {comment.userId.lastName}
                        </strong>
                        <small className="text-muted">{formatDate(comment.dateTime)}</small>
                      </div>
                      <p className="mb-0 mt-2 keep-lines">{comment.comment}</p>
                    </div>
                  ))
                )}

                {user ? (
                  <CommentForm photoId={id} onCommentAdded={handleCommentAdded} />
                ) : (
                  <div className="alert alert-info mt-4">
                    Please <Link to="/login">log in</Link> to add a comment.
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PhotoDetail;
