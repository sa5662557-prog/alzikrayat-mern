import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <main className="home-hero bg-light py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="badge bg-primary mb-3">Welcome to Alzikrayat</span>

            <h1 className="display-4 fw-bold">Keep Your Memories Alive</h1>

            <p className="lead mt-3">
              Alzikrayat is a photo sharing application designed to help people
              preserve, organize, and share their special memories.
            </p>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <Link to="/gallery" className="btn btn-primary btn-lg">
                Browse Gallery
              </Link>

              {!user && (
                <Link to="/login" className="btn btn-outline-dark btn-lg">
                  Login / Register
                </Link>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"
              alt="Beautiful memory landscape"
              className="img-fluid rounded-4 shadow"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
