import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying your login link...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Invalid link. No token found.');
      return;
    }

    fetch('http://localhost:3000/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        setStatus(data.error);
        return;
      }
      
      // Save token to localStorage for authenticated requests later
      localStorage.setItem('token', token);
      
      setStatus('Success! Redirecting...');
      
      setTimeout(() => {
        if (data.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    })
    .catch(err => {
      console.error(err);
      setStatus('An error occurred during verification.');
    });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-sm border border-brand-dark/5">
        <h1 className="text-2xl font-serif text-[#3A2A20] mb-4">Verifying...</h1>
        <p className="text-sm font-medium text-[#3A2A20]/70">{status}</p>
      </div>
    </div>
  );
}
