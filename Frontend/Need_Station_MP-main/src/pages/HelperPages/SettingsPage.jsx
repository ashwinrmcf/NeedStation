import { User, Bell, Shield, Phone, MapPin, Star, Clock, Heart, Languages, LogOut, Edit3, Camera, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import DashboardHeader from "../../components/common/DashboardHeader";
import LanguageSelector from "../../components/common/LanguageSelector";

const SettingsPage = () => {
	const { t } = useTranslation();
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [workerData, setWorkerData] = useState(null);

	// Fetch worker data from backend
	useEffect(() => {
		const fetchWorkerData = async () => {
			try {
				setLoading(true);
				// Get worker ID from localStorage or auth context
				const workerId = localStorage.getItem('workerId') || localStorage.getItem('userId');
				
				console.log('Fetching data for worker ID:', workerId); // Debug log
				
				if (!workerId) {
					throw new Error('No worker ID found. Please login again.');
				}

				// Use your actual backend URL and endpoint
				const response = await fetch(`http://localhost:8080/api/worker/details/${workerId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						// Remove Authorization header if not implemented yet
						// 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
					}
				});

				console.log('API Response status:', response.status); // Debug log

				if (!response.ok) {
					throw new Error(`Failed to fetch worker data: ${response.status} ${response.statusText}`);
				}

				const data = await response.json();
				console.log('Raw API data:', data); // Debug log
				
				// Parse JSON fields if they come as strings from database
				const parsedData = {
					...data,
					services: typeof data.services === 'string' ? JSON.parse(data.services || '{}') : (data.services || {}),
					languages: typeof data.languages === 'string' ? JSON.parse(data.languages || '{}') : (data.languages || {}),
					availability: typeof data.availability === 'string' ? JSON.parse(data.availability || '{}') : (data.availability || {})
				};

				console.log('Parsed data:', parsedData); // Debug log
				console.log('Profile Image URL from API:', data.profileImageUrl); // Specific debug for image
				console.log('Profile Image URL type:', typeof data.profileImageUrl); // Check data type
				console.log('Profile Image URL length:', data.profileImageUrl ? data.profileImageUrl.length : 'null/undefined'); // Check length

				setWorkerData(parsedData);
				setError(null);
			} catch (err) {
				console.error('Error fetching worker data:', err);
				setError(err.message);
				// Show error message instead of fallback data to debug the issue
				alert(`Failed to load profile data: ${err.message}. Check console for details.`);
			} finally {
				setLoading(false);
			}
		};

		fetchWorkerData();
	}, []);

	// Update worker data on backend
	const updateWorkerData = async (updatedData) => {
		try {
			// For now, just simulate a successful update since there's no PUT endpoint
			// In a real implementation, you would call the backend API here
			console.log('Would update worker data:', updatedData);
			
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Update local state for now
			setWorkerData(prevData => ({
				...prevData,
				...updatedData
			}));
			
			alert('Profile updated successfully! (Note: This is a local update only)');
			setIsEditing(false);
		} catch (error) {
			console.error('Error updating worker data:', error);
			alert('Failed to update profile. Please try again.');
		}
	};

	const handleSave = () => {
		if (workerData) {
			updateWorkerData(workerData);
		}
	};

	if (loading) {
		return (
			<div className='flex-1 flex flex-col h-full'>
				<div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
					<DashboardHeader title='Settings' />
					<LanguageSelector />
				</div>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E0B8] mx-auto mb-4"></div>
						<p className="text-gray-400">Loading your profile...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error && !workerData) {
		return (
			<div className='flex-1 flex flex-col h-full'>
				<div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
					<DashboardHeader title='Settings' />
					<LanguageSelector />
				</div>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<p className="text-red-400 mb-4">Error: {error}</p>
						<button 
							onClick={() => window.location.reload()} 
							className="bg-[#00E0B8] text-gray-900 px-4 py-2 rounded-lg font-semibold"
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='flex-1 flex flex-col h-full'>
			{/* Header with language selector */}
			<div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
				<DashboardHeader title='Settings' />
				<LanguageSelector />
			</div>
			
			{/* Content area */}
			<main className='flex-1 py-6 px-4 lg:px-8 max-w-4xl mx-auto w-full space-y-6'>
				{/* Profile Section */}
				<motion.div
					className="bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<User className="text-[#00E0B8]" size={24} />
							<h2 className='text-xl font-semibold text-gray-100'>Profile Information</h2>
						</div>
						<button
							onClick={isEditing ? handleSave : () => setIsEditing(true)}
							className="bg-[#00E0B8] hover:bg-[#00C4A0] text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
						>
							{isEditing ? <Save size={16} /> : <Edit3 size={16} />}
							{isEditing ? 'Save' : 'Edit'}
						</button>
					</div>

					{/* Profile Header */}
					<div className="text-center mb-8">
						<div className="relative inline-block">
							{workerData.profileImageUrl && workerData.profileImageUrl.trim() !== '' ? (
								<img 
									src={workerData.profileImageUrl} 
									alt="Profile" 
									className="h-24 w-24 rounded-full object-cover border-3 border-[#00E0B8] mx-auto"
									onError={(e) => {
										console.log("Profile image failed to load:", workerData.profileImageUrl);
										console.log("Error details:", e);
										e.target.style.display = 'none';
										e.target.parentNode.innerHTML = `<div class='h-24 w-24 rounded-full bg-gradient-to-r from-[#00E0B8] to-[#00C4A0] flex items-center justify-center text-gray-900 font-bold text-3xl mx-auto'>${workerData.fullName ? workerData.fullName.charAt(0).toUpperCase() : 'W'}</div>`;
									}}
									onLoad={() => console.log("Profile image loaded successfully:", workerData.profileImageUrl)}
								/>
							) : (
								<div className='h-24 w-24 rounded-full bg-gradient-to-r from-[#00E0B8] to-[#00C4A0] flex items-center justify-center text-gray-900 font-bold text-3xl mx-auto'>
									{workerData.fullName ? workerData.fullName.charAt(0).toUpperCase() : 'W'}
								</div>
							)}
							{isEditing && (
								<button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full">
									<Camera size={14} />
								</button>
							)}
						</div>
						<h3 className='text-2xl font-semibold text-white mt-4'>{workerData.fullName || 'Worker Name'}</h3>
						<div className="flex items-center justify-center gap-3 text-green-400 mt-2">
							<Shield size={18} />
							<span className="font-medium">{workerData.registrationStatus || 'PENDING'}</span>
							{workerData.phoneVerified === "1" && (
								<span className="text-blue-400">• Phone Verified</span>
							)}
						</div>
					</div>

					{/* Basic Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
						<div className="space-y-6">
							<h4 className="text-lg font-medium text-gray-200 border-b border-gray-600 pb-2">Contact Information</h4>
							
							<div>
								<label className="text-sm text-gray-400 block mb-2">Phone Number</label>
								<div className="flex items-center gap-3 text-white">
									<Phone size={18} className="text-[#00E0B8]" />
									{isEditing ? (
										<input 
											type="tel" 
											value={workerData.phone || ''}
											className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-[#00E0B8] focus:outline-none flex-1"
											onChange={(e) => setWorkerData({...workerData, phone: e.target.value})}
										/>
									) : (
										<span className="text-lg">{workerData.phone || 'Not provided'}</span>
									)}
								</div>
							</div>

							<div>
								<label className="text-sm text-gray-400 block mb-2">Email Address</label>
								<div className="flex items-center gap-3 text-white">
									<User size={18} className="text-[#00E0B8]" />
									<span className="text-lg">{workerData.email || 'Not provided'}</span>
								</div>
							</div>

							<div>
								<label className="text-sm text-gray-400 block mb-2">Location</label>
								<div className="flex items-center gap-3 text-white">
									<MapPin size={18} className="text-[#00E0B8]" />
									{isEditing ? (
										<input 
											type="text" 
											value={workerData.currentAddress || ''}
											className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-[#00E0B8] focus:outline-none flex-1"
											onChange={(e) => setWorkerData({...workerData, currentAddress: e.target.value})}
										/>
									) : (
										<span className="text-lg">{(workerData.currentAddress || 'Address not provided')}{workerData.city ? `, ${workerData.city}` : ''}{workerData.pincode ? ` - ${workerData.pincode}` : ''}</span>
									)}
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<h4 className="text-lg font-medium text-gray-200 border-b border-gray-600 pb-2">Professional Details</h4>
							
							<div>
								<label className="text-sm text-gray-400 block mb-3">Services Offered</label>
								<div className="flex flex-wrap gap-2">
									{workerData.services && Object.entries(workerData.services)
										.filter(([key, value]) => value === true)
										.map(([service, value]) => (
											<span key={service} className="bg-[#00E0B8] text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
												{service.charAt(0).toUpperCase() + service.slice(1)}
											</span>
										))}
									{(!workerData.services || Object.keys(workerData.services).length === 0) && (
										<span className="text-gray-400">No services specified</span>
									)}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<div>
									<label className="text-sm text-gray-400 block mb-2">Experience</label>
									<div className="flex items-center gap-2 text-white">
										<Clock size={18} className="text-[#00E0B8]" />
										<span className="text-lg">{workerData.experience || '1-3'} years</span>
									</div>
								</div>
								<div>
									<label className="text-sm text-gray-400 block mb-2">Work Type</label>
									<div className="flex items-center gap-2 text-white">
										<Heart size={18} className="text-[#00E0B8]" />
										<span className="text-lg">{workerData.workType || 'Not specified'}</span>
									</div>
								</div>
							</div>

							<div>
								<label className="text-sm text-gray-400 block mb-3">Languages Known</label>
								<div className="flex flex-wrap gap-2">
									{workerData.languages && Object.entries(workerData.languages)
										.filter(([key, value]) => value === true)
										.map(([language, value]) => (
											<span key={language} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
												{language.charAt(0).toUpperCase() + language.slice(1)}
											</span>
										))}
									{(!workerData.languages || Object.keys(workerData.languages).length === 0) && (
										<span className="text-gray-400">No languages specified</span>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Additional Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<label className="text-sm text-gray-400 block mb-2">Gender</label>
							<div className="flex items-center gap-3 text-white">
								<User size={18} className="text-[#00E0B8]" />
								<span className="text-lg">{workerData.gender || 'Not specified'}</span>
							</div>
						</div>
						<div>
							<label className="text-sm text-gray-400 block mb-2">Payment Mode</label>
							<div className="flex items-center gap-3 text-white">
								<Clock size={18} className="text-[#00E0B8]" />
								<span className="text-lg">{workerData.paymentMode || 'Not specified'}</span>
							</div>
						</div>
					</div>
				</motion.div>


				{/* Emergency Contact */}
				<motion.div
					className="bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<div className="flex items-center gap-3 mb-6">
						<Shield className="text-[#00E0B8]" size={24} />
						<h2 className='text-xl font-semibold text-gray-100'>Emergency Contact</h2>
					</div>

					<div className="bg-gray-800 rounded-lg p-4">
						<label className="text-sm text-gray-400">Emergency Contact Number</label>
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-white">
								<User size={16} className="text-red-400" />
								<span className="text-gray-400">Name:</span>
								{isEditing ? (
									<input 
										type="text" 
										value={workerData.emergencyContactName || ''}
										className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-[#00E0B8] focus:outline-none"
										onChange={(e) => setWorkerData({...workerData, emergencyContactName: e.target.value})}
									/>
								) : (
									<span>{workerData.emergencyContactName || 'Not provided'}</span>
								)}
							</div>
							<div className="flex items-center gap-2 text-white">
								<Phone size={16} className="text-red-400" />
								<span className="text-gray-400">Phone:</span>
								{isEditing ? (
									<input 
										type="tel" 
										value={workerData.emergencyContactNumber || ''}
										className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-[#00E0B8] focus:outline-none"
										onChange={(e) => setWorkerData({...workerData, emergencyContactNumber: e.target.value})}
									/>
								) : (
									<span>{workerData.emergencyContactNumber || 'Not provided'}</span>
								)}
							</div>
						</div>
						<p className="text-gray-400 text-sm mt-2">This contact will be notified in case of emergency during tasks</p>
					</div>
				</motion.div>

				{/* Language & Support */}
				<motion.div
					className="bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<div className="flex items-center gap-3 mb-6">
						<Languages className="text-[#00E0B8]" size={24} />
						<h2 className='text-xl font-semibold text-gray-100'>Support & Help</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<button className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg text-left transition-colors">
							<h3 className="font-medium mb-1">Help Center</h3>
							<p className="text-gray-400 text-sm">Get help with common questions</p>
						</button>
						<button className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg text-left transition-colors">
							<h3 className="font-medium mb-1">Contact Support</h3>
							<p className="text-gray-400 text-sm">Speak with our support team</p>
						</button>
						<button className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg text-left transition-colors">
							<h3 className="font-medium mb-1">Training Materials</h3>
							<p className="text-gray-400 text-sm">Access training videos and guides</p>
						</button>
						<button className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg text-left transition-colors">
							<h3 className="font-medium mb-1">Safety Guidelines</h3>
							<p className="text-gray-400 text-sm">Important safety protocols</p>
						</button>
					</div>
				</motion.div>

				{/* Logout */}
				<motion.div
					className="bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-red-700"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
						<LogOut size={20} />
						Logout from NeedStation
					</button>
				</motion.div>
			</main>
		</div>
	);
};
export default SettingsPage;
