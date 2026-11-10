import { Link } from 'react-router-dom';

function PhotoCard({ photo }) {
  const uploadedAt = new Date(photo.dateTime).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="card h-100 shadow-sm photo-card">
      <img
        src={`/uploads/${photo.fileName}`}
        className="card-img-top gallery-image"
        alt={photo.title}
      />

      <div className="card-body d-flex flex-column">
        <h2 className="h5 card-title">{photo.title}</h2>

        {photo.description && (
          <p className="card-text text-muted photo-description">{photo.description}</p>
        )}

        <p className="small text-muted mb-3">
          By {photo.userId.firstName} {photo.userId.lastName}
          <br />
          {uploadedAt}
        </p>

        <Link to={`/photos/${photo._id}`} className="btn btn-outline-primary mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default PhotoCard;
