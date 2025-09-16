import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../../store/AuthContext.jsx';
import axios from 'axios';
import PortalModal from './PortalModal';

const DashboardHeader = ({ title }) => {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkerData = async () => {
      const workerId = localStorage.getItem('workerId');
      
      if (!workerId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/worker/details/${workerId}`);
        setWorker(response.data);
      } catch (err) {
        console.error('Error fetching worker data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, []);

  const initiateLogout = () => {
    setDropdownOpen(false);
    setShowLogoutConfirmation(true);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('workerId');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
    <header className='bg-gray-900 w-full sticky top-0 py-3 px-6 shadow-lg z-50 border-b border-gray-800' style={{marginTop: 0}}>
      <div className='w-full mx-auto'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-semibold text-white'>{title}</h1>
          
          <div className='flex items-center space-x-4'>
            {/* Notifications Icon */}
            <button className='relative p-2 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-teal-500 bg-gray-800 hover:bg-gray-700 transition-all duration-200'>
              <Bell size={20} />
              <span className='absolute top-1 right-1 block w-2.5 h-2.5 bg-teal-400 rounded-full shadow-glow'></span>
            </button>
            
            {/* User Menu */}
            <div className='relative'>
              <button 
                onClick={toggleDropdown}
                className='flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg border border-gray-700 hover:border-teal-500 bg-gray-800 hover:bg-gray-700 transition-all duration-200'
              >
                <div className='w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center shadow-lg overflow-hidden'>
                  {loading ? (
                    <div className='animate-pulse'>...</div>
                  ) : worker?.profileImageUrl ? (
                    <img 
                      src={worker.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Profile image failed to load, showing default icon");
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = '<svg class="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                      }}
                      onLoad={() => console.log("Worker profile image loaded successfully in header")}
                    />
                  ) : (
                    <User size={18} className='text-gray-900' />
                  )}
                </div>
                <span className='hidden md:inline-block font-medium'>
                  {loading ? 'Loading...' : worker?.fullName || 'Worker'}
                </span>
                <ChevronDown size={16} className='text-teal-400' />
              </button>
              
              {dropdownOpen && (
                <div className='absolute right-0 mt-2 w-60 bg-gray-800 rounded-lg shadow-xl py-2 z-10 border border-gray-700 backdrop-blur-md'>
                  <Link 
                    to='/helper/settings' 
                    className='flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 hover:text-teal-400 transition-colors font-medium'
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={16} className="text-gray-400" />
                    Profile Settings
                  </Link>
                  <div className='border-t border-gray-700 my-1'></div>
                  <button 
                    onClick={initiateLogout} 
                    className='flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors font-medium'
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Logout Confirmation Modal */}
    <PortalModal
      isOpen={showLogoutConfirmation}
      onClose={() => setShowLogoutConfirmation(false)}
      onConfirm={handleLogout}
      title="Confirm Logout"
      message="Are you sure you want to log out from your dashboard? Any unsaved progress will be lost."
      confirmText="Yes, log out"
      cancelText="Stay logged in"
    />
    </>
  );
};

export default DashboardHeader;
