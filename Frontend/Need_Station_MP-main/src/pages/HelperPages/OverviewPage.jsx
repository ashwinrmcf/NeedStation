import { 
  DollarSign, Clock, ClipboardList, Calendar, XCircle, Star, Eye, 
  Phone, AlertTriangle, Heart, Shield, MapPin, MessageCircle,
  CheckCircle, Users, Stethoscope, Pill, Activity, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

import DashboardHeader from "../../components/common/DashboardHeader";
import WelcomeCard from "../../components/overview/WelcomeCard";
import LanguageSelector from "../../components/common/LanguageSelector";
import ActiveBookingCard from "../../components/WorkerDashboard/ActiveBookingCard";

const OverviewPage = () => {
	const { t, ready } = useTranslation();
	
	// State to track welcome card visibility
	const [isWelcomeCardVisible, setIsWelcomeCardVisible] = useState(true);
	
	// Dynamic data from API
	const [todaysTasks, setTodaysTasks] = useState([]);
	const [stats, setStats] = useState(null);
	const [activeBooking, setActiveBooking] = useState(null);
	const [hasActiveBooking, setHasActiveBooking] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
	
	// Fetch worker data
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				const workerId = localStorage.getItem('workerId');
				
				if (!workerId) {
					setError('Worker ID not found. Please log in again.');
					return;
				}
				
				// Fetch stats, today's tasks, and active booking in parallel
				const [statsResponse, tasksResponse, activeBookingResponse] = await Promise.all([
					axios.get(`${API_URL}/worker/dashboard/stats/${workerId}`),
					axios.get(`${API_URL}/worker/dashboard/tasks/today/${workerId}`),
					axios.get(`${API_URL}/worker/${workerId}/active-booking`)
				]);
				
				setStats(statsResponse.data);
				setTodaysTasks(tasksResponse.data);
				
				// Handle active booking
				if (activeBookingResponse.data.hasActiveBooking) {
					setHasActiveBooking(true);
					setActiveBooking(activeBookingResponse.data.booking);
				}
				
				setError(null);
			} catch (err) {
				console.error('Error fetching dashboard data:', err);
				setError('Failed to load dashboard data');
			} finally {
				setLoading(false);
			}
		};
		
		fetchDashboardData();
	}, []);
	
	// Always show welcome card for 10 seconds on dashboard load, then allow manual control
	useEffect(() => {
		setIsWelcomeCardVisible(true);
		const timer = setTimeout(() => {
			setIsWelcomeCardVisible(false);
		}, 10000);
		return () => clearTimeout(timer);
	}, []);
	
	// Handle show/hide toggle
	const handleVisibilityChange = (visible) => {
		setIsWelcomeCardVisible(visible);
	};
	
	// Function to unhide the welcome card
	const unhideWelcomeCard = () => {
		setIsWelcomeCardVisible(true);
		const workerId = localStorage.getItem('workerId');
		if (workerId) {
			localStorage.removeItem(`worker_${workerId}_welcomed`);
		}
	};

	// Show loading if translations aren't ready or data is loading
	if (!ready || loading) {
		return (
			<div className='flex-1 flex items-center justify-center h-full'>
				<div className='text-white text-xl flex items-center gap-2'>
					<Loader2 className='animate-spin' size={24} />
					Loading...
				</div>
			</div>
		);
	}
	
	// Show error if data fetch failed
	if (error) {
		return (
			<div className='flex-1 flex items-center justify-center h-full'>
				<div className='text-red-400 text-xl'>{error}</div>
			</div>
		);
	}

	return (
		<div className='flex-1 flex flex-col h-full'>
			{/* Fixed position header at the top */}
			<div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
				<DashboardHeader title={t("overview")} />
				<LanguageSelector />
			</div>

			{/* Content area */}
			<main className='flex-1 py-6 px-4 lg:px-8 max-w-7xl mx-auto w-full'>
				{/* Active Booking Card - Shows when worker has an active booking */}
				{hasActiveBooking && activeBooking && (
					<ActiveBookingCard booking={activeBooking} />
				)}
				
				{/* Welcome Card for newly registered workers */}
				<AnimatePresence>
					{isWelcomeCardVisible ? (
						<WelcomeCard 
							key="welcome-card"
							isVisible={true} 
							onVisibilityChange={handleVisibilityChange} 
						/>
					) : (
						<motion.button 
							key="show-button"
							onClick={unhideWelcomeCard}
							className="mb-4 flex items-center gap-2 bg-gray-800 text-[#00E0B8] px-4 py-2 rounded-md border border-[#00E0B8] hover:bg-gray-700 transition-colors"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: 0.2 }}
						>
							<Eye size={18} />
							<span>Show Welcome Card</span>
						</motion.button>
					)}
				</AnimatePresence>
				
				{/* MY TASKS */}
				<motion.div 
					className='bg-gray-800 rounded-lg p-6 border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<div className='flex items-center gap-2 mb-4'>
						<ClipboardList className='text-[#00E0B8]' size={24} />
						<h2 className='text-xl font-semibold text-white'>My Tasks</h2>
					</div>
					<div className='space-y-3'>
						{todaysTasks.map((task) => (
							<div key={task.id} className='bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-[#00E0B8] transition-colors'>
								<div className='flex items-center justify-between mb-3'>
									<div className='flex items-center gap-3'>
										<div className='bg-[#00E0B8] rounded-full p-2'>
											<Heart className='text-gray-900' size={18} />
										</div>
										<div>
											<p className='text-white font-medium'>{task.customerName || 'Customer'}</p>
											<p className='text-[#00E0B8] text-sm font-medium'>{task.serviceName}</p>
										</div>
									</div>
									<div className='text-right'>
										<p className='text-green-400 font-bold text-lg'>₹{task.totalAmount}</p>
										<p className='text-gray-400 text-xs'>{task.preferredTime || task.preferredTimeSlot}</p>
									</div>
								</div>
								
								{/* Task Details */}
								<div className='grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-600'>
									<div className='flex items-center gap-2 text-gray-400 text-xs'>
										<MapPin size={12} className='text-[#00E0B8]' />
										<span>{task.city}</span>
									</div>
									<div className='flex items-center gap-2 text-gray-400 text-xs'>
										<Phone size={12} className='text-[#00E0B8]' />
										<span>{task.phone}</span>
									</div>
								</div>
								
								{/* Status Badge */}
								{task.status === 'PENDING_WORKER_ASSIGNMENT' && (
									<div className='mt-3 flex items-center gap-2'>
										<div className='bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
											<AlertTriangle size={12} />
											<span>New Request - Action Required</span>
										</div>
									</div>
								)}
								{task.status === 'ASSIGNED' && (
									<div className='mt-3 flex items-center gap-2'>
										<div className='bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
											<CheckCircle size={12} />
											<span>Accepted - Ready to Start</span>
										</div>
									</div>
								)}
							</div>
						))}
						{todaysTasks.length === 0 && (
							<div className='text-center py-8 text-gray-400'>
								<Calendar size={48} className='mx-auto mb-2 opacity-50' />
								<p>No tasks available at the moment</p>
							</div>
						)}
					</div>
				</motion.div>

				{/* SIMPLE STATS CARDS */}
				<motion.div
					className='grid grid-cols-2 gap-4 mb-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<div className='bg-gray-800 rounded-lg p-4 text-center'>
						<CheckCircle className='text-green-400 mx-auto mb-2' size={32} />
						<p className='text-2xl font-bold text-white'>{stats?.tasksThisWeek || 0}</p>
						<p className='text-gray-400 text-sm'>{t("tasksThisWeek")}</p>
					</div>
					<div className='bg-gray-800 rounded-lg p-4 text-center'>
						<DollarSign className='text-green-400 mx-auto mb-2' size={32} />
						<p className='text-2xl font-bold text-white'>₹{stats?.monthlyEarnings || 0}</p>
						<p className='text-gray-400 text-sm'>{t("monthlyEarnings")}</p>
					</div>
					<div className='bg-gray-800 rounded-lg p-4 text-center'>
						<Star className='text-yellow-400 mx-auto mb-2' size={32} />
						<p className='text-2xl font-bold text-white'>{stats?.averageRating?.toFixed(1) || 0}/5</p>
						<p className='text-gray-400 text-sm'>{t("yourRating")}</p>
					</div>
					<div className='bg-gray-800 rounded-lg p-4 text-center'>
						<MessageCircle className='text-blue-400 mx-auto mb-2' size={32} />
						<p className='text-2xl font-bold text-white'>{stats?.newMessages || 0}</p>
						<p className='text-gray-400 text-sm'>{t("newMessages")}</p>
					</div>
				</motion.div>

				{/* QUICK ACTIONS */}
				<motion.div
					className='bg-gray-800 rounded-lg p-6 mb-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
						<Activity className='text-[#00E0B8]' size={24} />
						{t("quickActions")}
					</h3>
					<div className='grid grid-cols-2 gap-4'>
						<button className='bg-[#00E0B8] hover:bg-[#00C4A0] text-gray-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors'>
							<MapPin size={20} />
							<span>{t("markLocation")}</span>
						</button>
						<button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors'>
							<Phone size={20} />
							<span>{t("callSupport")}</span>
						</button>
						<button className='bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors'>
							<CheckCircle size={20} />
							<span>{t("completeTask")}</span>
						</button>
						<button className='bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors'>
							<AlertTriangle size={20} />
							<span>{t("reportIssue")}</span>
						</button>
					</div>
				</motion.div>

				{/* HEALTH REMINDERS */}
				<motion.div
					className='bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
				>
					<h3 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
						<Shield className='text-[#00E0B8]' size={24} />
						{t("healthSafetyReminders")}
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
						<div className='flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 border border-[#00E0B8] border-opacity-30 transition-colors'>
							<div className='text-2xl'>🧼</div>
							<span className='text-white text-sm md:text-base'>{t("washHands")}</span>
						</div>
						<div className='flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 border border-[#00E0B8] border-opacity-30 transition-colors'>
							<div className='text-2xl'>😷</div>
							<span className='text-white text-sm md:text-base'>{t("wearMask")}</span>
						</div>
						<div className='flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 border border-[#00E0B8] border-opacity-30 transition-colors'>
							<div className='text-2xl'>📋</div>
							<span className='text-white text-sm md:text-base'>{t("checkPatient")}</span>
						</div>
						<div className='flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 border border-[#00E0B8] border-opacity-30 transition-colors'>
							<div className='text-2xl'>💊</div>
							<span className='text-white text-sm md:text-base'>{t("medicineTime")}</span>
						</div>
					</div>
				</motion.div>

				{/* EMERGENCY CONTACTS */}
				<motion.div
					className='bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.8 }}
				>
					<h3 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
						<AlertTriangle className='text-red-400' size={24} />
						{t("emergencyContacts")}
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div className='bg-red-800 rounded-lg p-4 text-center'>
							<div className='text-3xl mb-2'>🚑</div>
							<p className='text-white font-semibold'>{t("ambulance")}</p>
							<p className='text-red-200 text-xl font-bold'>108</p>
						</div>
						<div className='bg-blue-800 rounded-lg p-4 text-center'>
							<div className='text-3xl mb-2'>👮</div>
							<p className='text-white font-semibold'>{t("police")}</p>
							<p className='text-blue-200 text-xl font-bold'>100</p>
						</div>
						<div className='bg-green-800 rounded-lg p-4 text-center'>
							<div className='text-3xl mb-2'>📞</div>
							<p className='text-white font-semibold'>NeedStation</p>
							<p className='text-green-200 text-lg font-bold'>+91-XXXXX</p>
						</div>
					</div>
				</motion.div>
			</main>
		</div>
	);
};
export default OverviewPage;
