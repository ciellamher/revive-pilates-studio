import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/base';
import { useAuth } from '../contexts/AuthContext';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Verifying your login link...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Invalid link. No token found.');
      return;
    }

    fetch(`${API_BASE}/api/auth/verify`, {
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
      
      // The link is exchanged for a session, which is what signs you in.
      login({ token: data.token, user: data.user });
      
      setStatus('Success! Redirecting...');
      
      setTimeout(() => {
        let returnTo = null;
        try {
          returnTo = localStorage.getItem('revive:returnTo');
          localStorage.removeItem('revive:returnTo');
        } catch {
          // No storage: use the default page below.
        }
        // Only same-site paths, never a full address someone slipped in.
        if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
          navigate(returnTo);
        } else if (data.user.isAdmin) {
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
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-sm border border-brand-dark/5">
        <h1 className="text-2xl font-serif text-[#3A2A20] mb-4">Verifying...</h1>
        <p className="text-sm font-medium text-[#3A2A20]/70">{status}</p>
      </div>
    </div>
  );
}
