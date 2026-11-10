import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../App';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function LoginRegister() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/gallery" replace />;
  }

  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-lg-6">
          <LoginForm />
        </div>

        <div className="col-lg-6">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}

export default LoginRegister;
