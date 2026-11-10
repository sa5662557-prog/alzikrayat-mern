import { useContext, useState } from 'react';
import { AuthContext } from '../App';

function UploadForm({ onPhotoUploaded, onCancel }) {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please choose a photo to upload');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('photo', file);

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onPhotoUploaded(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm mb-5">
      <div className="card-body p-4">
        <h2 className="h4 fw-bold mb-2">Add New Photo</h2>
        <p className="text-muted mb-4">Share a special memory with the Alzikrayat community.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="photo" className="form-label">Choose Photo</label>
            <input
              type="file"
              id="photo"
              className="form-control"
              accept="image/jpeg,image/png,image/gif"
              onChange={(e) => setFile(e.target.files[0] || null)}
              required
            />
            <div className="form-text">Allowed formats: JPG, PNG, GIF. Maximum size: 5 MB.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              maxLength="150"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-control"
              rows="4"
              maxLength="1000"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload Photo'}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadForm;
