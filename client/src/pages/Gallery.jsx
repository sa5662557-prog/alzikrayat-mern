import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import PhotoCard from '../components/PhotoCard';
import UploadForm from '../components/UploadForm';

function Gallery() {
  const { user } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetch('/api/photos')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not load photos');
        }
        return res.json();
      })
      .then((data) => setPhotos(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePhotoUploaded = (newPhoto) => {
    setPhotos([newPhoto, ...photos]);
    setShowUploadForm(false);
  };

  return (
    <main className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">Photo Gallery</h1>
          <p className="text-muted mb-0">Explore memories shared by Alzikrayat users.</p>
        </div>

        {user && !showUploadForm && (
          <button className="btn btn-primary" onClick={() => setShowUploadForm(true)}>
            Add Photo
          </button>
        )}
      </div>

      {user && showUploadForm && (
        <UploadForm
          onPhotoUploaded={handlePhotoUploaded}
          onCancel={() => setShowUploadForm(false)}
        />
      )}

      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading photos...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!isLoading && !error && photos.length === 0 && (
        <div className="alert alert-info text-center">No photos have been shared yet.</div>
      )}

      {photos.length > 0 && (
        <>
          <div className="gallery-toolbar mb-4">
            <span className="fw-semibold">Viewing Style:</span>

            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-outline-primary ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
              >
                Grid
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                List
              </button>
            </div>
          </div>

          <div className={`gallery-${view}`}>
            {photos.map((photo) => (
              <PhotoCard key={photo._id} photo={photo} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Gallery;
