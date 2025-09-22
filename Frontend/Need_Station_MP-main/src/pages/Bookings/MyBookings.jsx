import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import styles from './MyBookings.module.css';
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaStar, FaEye,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRedo, FaFilter,
  FaSearch, FaDownload, FaHeart, FaUserMd, FaHome, FaShieldAlt,
  FaCommentDots, FaExclamationTriangle, FaThumbsUp, FaThumbsDown
} from 'react-icons/fa';

const MyBookings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock booking data - replace with API call
  const [bookings] = useState([
    {
      id: 'BK001',
      serviceName: 'Elder Care - Companion Care',
      serviceType: 'elder-care',
      providerName: 'Priya Sharma',
      providerImage: null,
      providerRating: 4.8,
      bookingDate: '2024-01-15',
      serviceDate: '2024-01-20',
      serviceTime: '09:00 AM - 05:00 PM',
      duration: '8 hours',
      status: 'completed',
      amount: 1200,
      address: '123 MG Road, Bangalore, Karnataka 560001',
      phone: '+91 98765 43210',
      specialInstructions: 'Patient has mild dementia, needs gentle care',
      rating: 5,
      review: 'Excellent service, very caring and professional',
      canRebook: true,
      canCancel: false
    },
    {
      id: 'BK002',
      serviceName: 'Nursing Care - General Nursing',
      serviceType: 'nursing-care',
      providerName: 'Dr. Rajesh Kumar',
      providerImage: null,
      providerRating: 4.9,
      bookingDate: '2024-01-18',
      serviceDate: '2024-01-25',
      serviceTime: '10:00 AM - 02:00 PM',
      duration: '4 hours',
      status: 'confirmed',
      amount: 800,
      address: '456 Brigade Road, Bangalore, Karnataka 560025',
      phone: '+91 87654 32109',
      specialInstructions: 'Post-surgery wound care required',
      canRebook: false,
      canCancel: true
    },
    {
      id: 'BK003',
      serviceName: 'Physiotherapy - Orthopedic',
      serviceType: 'physiotherapy',
      providerName: 'Anita Desai',
      providerImage: null,
      providerRating: 4.7,
      bookingDate: '2024-01-20',
      serviceDate: '2024-01-28',
      serviceTime: '06:00 PM - 07:00 PM',
      duration: '1 hour',
      status: 'pending',
      amount: 600,
      address: '789 Koramangala, Bangalore, Karnataka 560034',
      phone: '+91 76543 21098',
      specialInstructions: 'Knee replacement recovery therapy',
      canRebook: false,
      canCancel: true
    },
    {
      id: 'BK004',
      serviceName: 'Diabetes Management - Type 2',
      serviceType: 'diabetes-care',
      providerName: 'Nurse Meera',
      providerImage: null,
      providerRating: 4.6,
      bookingDate: '2024-01-10',
      serviceDate: '2024-01-15',
      serviceTime: '08:00 AM - 09:00 AM',
      duration: '1 hour',
      status: 'cancelled',
      amount: 400,
      address: '321 Indiranagar, Bangalore, Karnataka 560038',
      phone: '+91 65432 10987',
      specialInstructions: 'Blood sugar monitoring and medication',
      canRebook: true,
      canCancel: false
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className={styles.statusCompleted} />;
      case 'confirmed': return <FaHourglassHalf className={styles.statusConfirmed} />;
      case 'pending': return <FaClock className={styles.statusPending} />;
      case 'cancelled': return <FaTimesCircle className={styles.statusCancelled} />;
      default: return <FaClock />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'elder-care': return <FaHeart className={styles.serviceIcon} />;
      case 'nursing-care': return <FaUserMd className={styles.serviceIcon} />;
      case 'physiotherapy': return <FaRedo className={styles.serviceIcon} />;
      case 'diabetes-care': return <FaShieldAlt className={styles.serviceIcon} />;
      default: return <FaHome className={styles.serviceIcon} />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch = booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleRebook = (bookingId) => {
    console.log('Rebooking:', bookingId);
    // Implement rebook logic
  };

  const handleCancel = (bookingId) => {
    console.log('Cancelling:', bookingId);
    // Implement cancel logic
  };

  const handleRateService = (bookingId, rating) => {
    console.log('Rating service:', bookingId, rating);
    // Implement rating logic
  };

  return (
    <div className={styles.bookingsContainer}>
      {/* Header */}
      <div className={styles.bookingsHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.pageTitle}>My Bookings</h1>
            <p className={styles.pageSubtitle}>Manage your healthcare service bookings</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{bookings.length}</div>
              <div className={styles.statLabel}>Total Bookings</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className={styles.statLabel}>Upcoming</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.tabsContainer}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className={styles.tabCount}>
                {tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length}
              </span>
            </button>
          ))}
        </div>
        
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className={styles.bookingsList}>
        {filteredBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <FaCalendarAlt size={48} className={styles.emptyIcon} />
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet or no bookings match your search.</p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.bookingInfo}>
                  <div className={styles.serviceInfo}>
                    {getServiceIcon(booking.serviceType)}
                    <div>
                      <h3 className={styles.serviceName}>{booking.serviceName}</h3>
                      <p className={styles.bookingId}>Booking ID: {booking.id}</p>
                    </div>
                  </div>
                  <div className={styles.bookingStatus}>
                    {getStatusIcon(booking.status)}
                    <span className={styles.statusText}>{getStatusText(booking.status)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <FaUserMd className={styles.detailIcon} />
                    <div>
                      <span className={styles.detailLabel}>Provider</span>
                      <span className={styles.detailValue}>{booking.providerName}</span>
                      <div className={styles.rating}>
                        <FaStar className={styles.starIcon} />
                        <span>{booking.providerRating}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <FaCalendarAlt className={styles.detailIcon} />
                    <div>
                      <span className={styles.detailLabel}>Service Date</span>
                      <span className={styles.detailValue}>
                        {new Date(booking.serviceDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <FaClock className={styles.detailIcon} />
                    <div>
                      <span className={styles.detailLabel}>Time & Duration</span>
                      <span className={styles.detailValue}>{booking.serviceTime}</span>
                      <span className={styles.duration}>({booking.duration})</span>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <FaMapMarkerAlt className={styles.detailIcon} />
                    <div>
                      <span className={styles.detailLabel}>Location</span>
                      <span className={styles.detailValue}>{booking.address}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.amountSection}>
                  <span className={styles.amount}>₹{booking.amount}</span>
                </div>
              </div>

              <div className={styles.bookingActions}>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleViewDetails(booking)}
                >
                  <FaEye /> View Details
                </button>

                {booking.canRebook && (
                  <button 
                    className={`${styles.actionButton} ${styles.rebookButton}`}
                    onClick={() => handleRebook(booking.id)}
                  >
                    <FaRedo /> Rebook
                  </button>
                )}

                {booking.canCancel && (
                  <button 
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    onClick={() => handleCancel(booking.id)}
                  >
                    <FaTimesCircle /> Cancel
                  </button>
                )}

                {booking.status === 'completed' && !booking.rating && (
                  <button 
                    className={`${styles.actionButton} ${styles.rateButton}`}
                    onClick={() => handleRateService(booking.id)}
                  >
                    <FaStar /> Rate Service
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Booking Details</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <FaTimesCircle />
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.modalSection}>
                <h3>Service Information</h3>
                <div className={styles.modalGrid}>
                  <div><strong>Service:</strong> {selectedBooking.serviceName}</div>
                  <div><strong>Booking ID:</strong> {selectedBooking.id}</div>
                  <div><strong>Status:</strong> {getStatusText(selectedBooking.status)}</div>
                  <div><strong>Amount:</strong> ₹{selectedBooking.amount}</div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3>Provider Information</h3>
                <div className={styles.modalGrid}>
                  <div><strong>Name:</strong> {selectedBooking.providerName}</div>
                  <div><strong>Rating:</strong> {selectedBooking.providerRating}/5</div>
                  <div><strong>Phone:</strong> {selectedBooking.phone}</div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h3>Schedule & Location</h3>
                <div className={styles.modalGrid}>
                  <div><strong>Date:</strong> {new Date(selectedBooking.serviceDate).toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {selectedBooking.serviceTime}</div>
                  <div><strong>Duration:</strong> {selectedBooking.duration}</div>
                  <div><strong>Address:</strong> {selectedBooking.address}</div>
                </div>
              </div>

              {selectedBooking.specialInstructions && (
                <div className={styles.modalSection}>
                  <h3>Special Instructions</h3>
                  <p>{selectedBooking.specialInstructions}</p>
                </div>
              )}

              {selectedBooking.review && (
                <div className={styles.modalSection}>
                  <h3>Your Review</h3>
                  <div className={styles.reviewSection}>
                    <div className={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < selectedBooking.rating ? styles.starFilled : styles.starEmpty}
                        />
                      ))}
                    </div>
                    <p>{selectedBooking.review}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
