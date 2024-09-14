import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if the user's email matches the admin email
      if (user.email === 'testadmin@gmail.com') {
        // User is an admin
        navigate('/home');
      } else {
        // User is not an admin
        throw new Error('Only for admin');
      }

      toast.success('Login successful!', { autoClose: 2000 });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm mb-10 md:mb-0">
        <img className="w-full" src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="Sample" />
      </div>
      <div className="md:w-1/3 max-w-sm">
        <div className="mb-4">
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4 relative">
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="text-center md:text-left">
          <button
            onClick={signIn}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
          >
            Login
          </button>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Login;
