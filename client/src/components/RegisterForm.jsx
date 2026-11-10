import { useState } from 'react';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  description: ''
};

function RegisterForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Account created successfully. You can now login.');
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h2 className="card-title mb-4">Create Account</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                maxLength="50"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-sm-6 mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                maxLength="50"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="registerEmail" className="form-label">Email</label>
            <input
              type="email"
              id="registerEmail"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="registerPassword" className="form-label">Password</label>
            <input
              type="password"
              id="registerPassword"
              name="password"
              className="form-control"
              minLength="8"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="form-text">At least 8 characters.</div>
          </div>

          <div className="row">
            <div className="col-sm-6 mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                maxLength="100"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-6 mb-3">
              <label htmlFor="occupation" className="form-label">Occupation</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                className="form-control"
                maxLength="100"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="registerDescription" className="form-label">About You</label>
            <textarea
              id="registerDescription"
              name="description"
              className="form-control"
              rows="3"
              maxLength="500"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
