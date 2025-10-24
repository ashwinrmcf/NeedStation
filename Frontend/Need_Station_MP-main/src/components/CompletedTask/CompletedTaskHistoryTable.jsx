import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Search, Star, Clock, MapPin, Phone, Receipt, Eye, Calendar, DollarSign, Loader2 } from "lucide-react";

const TaskHistoryTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [userData, setUserData] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
	
	// Fetch completed tasks
	useEffect(() => {
		const fetchCompletedTasks = async () => {
			try {
				setLoading(true);
				const workerId = localStorage.getItem('workerId');
				
				if (!workerId) {
					setError('Worker ID not found');
					return;
				}
				
				const response = await axios.get(`${API_URL}/worker/dashboard/tasks/completed/${workerId}`);
				setUserData(response.data);
				setFilteredUsers(response.data);
				setError(null);
			} catch (err) {
				console.error('Error fetching completed tasks:', err);
				setError('Failed to load completed tasks');
			} finally {
				setLoading(false);
			}
		};
		
		fetchCompletedTasks();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) => 
				(user.customerName || '').toLowerCase().includes(term) || 
				(user.serviceName || '').toLowerCase().includes(term) ||
				(user.city || '').toLowerCase().includes(term) ||
				(user.fullAddress || '').toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};
	
	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<Loader2 className='animate-spin text-[#00E0B8]' size={48} />
			</div>
		);
	}
	
	if (error) {
		return (
			<div className='text-center py-12'>
				<p className='text-red-400 text-lg'>{error}</p>
			</div>
		);
	}

	return (
		<motion.div
			className='bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-cyan-300'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
				<div>
					<h2 className='text-xl font-semibold text-gray-100'>Completed Tasks History</h2>
					<p className='text-sm text-gray-400 mt-1'>Your healthcare service records and earnings</p>
				</div>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search by name, service, or location...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E0B8] w-full md:w-80'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			{/* Card-based layout for better mobile experience */}
			<div className='space-y-4'>
				{filteredUsers.length > 0 ? (
					filteredUsers.map((task) => (
						<motion.div
							key={task.id}
							className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#00E0B8] transition-colors"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							{/* Header with customer info and service */}
							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center gap-3">
									<div className='h-12 w-12 rounded-full bg-gradient-to-r from-[#00E0B8] to-[#00C4A0] flex items-center justify-center text-gray-900 font-bold text-lg'>
										{(task.customerName || 'C').charAt(0)}
									</div>
									<div>
										<h3 className="text-lg font-semibold text-white">{task.customerName || 'Customer'}</h3>
										<p className="text-[#00E0B8] font-medium">{task.serviceName}</p>
									</div>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold text-green-400">₹{task.totalAmount}</div>
									<div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
										<DollarSign size={12} className="mr-1" />
										Paid
									</div>
								</div>
							</div>

							{/* Task details grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div className="flex items-center gap-2 text-gray-400">
									<Calendar size={16} />
									<span>{task.completedAt ? new Date(task.completedAt).toLocaleString() : task.preferredDate}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-400">
									<Clock size={16} />
									<span>Time: {task.preferredTime || task.preferredTimeSlot || 'N/A'}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-400">
									<MapPin size={16} />
									<span>{task.city || task.fullAddress}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-400">
									<Phone size={16} />
									<span>{task.phone}</span>
								</div>
							</div>

							{/* Service notes */}
							{task.specialInstructions && (
								<div className="bg-gray-700 rounded-lg p-3 mb-4">
									<p className="text-sm text-gray-300">
										<span className="font-medium text-gray-200">Service Notes:</span> {task.specialInstructions}
									</p>
								</div>
							)}

							{/* Customer rating and feedback */}
							{task.customerRating ? (
								<div className="bg-gray-700 rounded-lg p-3 mb-4">
									<div className="flex items-center gap-2 mb-2">
										<span className="text-sm font-medium text-gray-300">Customer Rating:</span>
										<div className="flex items-center gap-1">
											{[...Array(5)].map((_, i) => (
												<Star 
													key={i} 
													size={16} 
													className={i < task.customerRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
												/>
											))}
											<span className="text-yellow-400 font-medium ml-1">{task.customerRating}/5</span>
										</div>
									</div>
									{task.customerFeedback && (
										<p className="text-sm text-gray-300 italic">"{task.customerFeedback}"</p>
									)}
								</div>
							) : (
								<div className="bg-gray-700 rounded-lg p-3 mb-4 text-center">
									<p className="text-sm text-gray-400">Waiting for customer feedback</p>
								</div>
							)}

							{/* Action buttons */}
							<div className="flex justify-between items-center">
								<div className="text-sm text-gray-400">
									<span className="font-medium">Booking #:</span> {task.bookingNumber || task.id}
								</div>
								<div className="flex gap-2">
									<button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm">
										<Eye size={14} />
										View Details
									</button>
									<button className="bg-[#00E0B8] hover:bg-[#00C4A0] text-gray-900 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm">
										<Receipt size={14} />
										Receipt
									</button>
								</div>
							</div>
						</motion.div>
					))
				) : (
					<div className="text-center py-12">
						<Search className="mx-auto mb-4 text-gray-400" size={48} />
						<p className="text-gray-400 text-lg">No completed tasks found matching your search</p>
					</div>
				)}
			</div>

		</motion.div>
	);
};
export default TaskHistoryTable;
