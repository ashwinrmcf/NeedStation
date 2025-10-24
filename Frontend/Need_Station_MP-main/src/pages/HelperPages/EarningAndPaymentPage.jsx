import { CheckCircle, Clock, DollarSign, Wallet, CreditCard, Calendar, Phone, MapPin, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

import DashboardHeader from "../../components/common/DashboardHeader";
import LanguageSelector from "../../components/common/LanguageSelector";

const EarningPage = () => {
	const { t } = useTranslation();
	const [earningData, setEarningData] = useState(null);
	const [recentEarnings, setRecentEarnings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
	
	// Fetch earnings data
	useEffect(() => {
		const fetchEarnings = async () => {
			try {
				setLoading(true);
				const workerId = localStorage.getItem('workerId');
				
				if (!workerId) {
					setError('Worker ID not found. Please log in again.');
					return;
				}
				
				// Fetch earnings and completed tasks in parallel
				const [earningsResponse, tasksResponse] = await Promise.all([
					axios.get(`${API_URL}/worker/dashboard/earnings/${workerId}?period=month`),
					axios.get(`${API_URL}/worker/dashboard/tasks/completed/${workerId}`)
				]);
				
				setEarningData(earningsResponse.data);
				setRecentEarnings(tasksResponse.data.slice(0, 10)); // Show last 10 tasks
				setError(null);
			} catch (err) {
				console.error('Error fetching earnings:', err);
				setError('Failed to load earnings data');
			} finally {
				setLoading(false);
			}
		};
		
		fetchEarnings();
	}, []);
	
	if (loading) {
		return (
			<div className='flex-1 flex items-center justify-center h-full'>
				<div className='text-white text-xl flex items-center gap-2'>
					<Loader2 className='animate-spin' size={24} />
					Loading...
				</div>
			</div>
		);
	}
	
	if (error) {
		return (
			<div className='flex-1 flex items-center justify-center h-full'>
				<div className='text-red-400 text-xl'>{error}</div>
			</div>
		);
	}
	
	return (
		<div className='flex-1 flex flex-col h-full'>
			{/* Header with language selector */}
			<div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
				<DashboardHeader title="Earnings & Payments" />
				<LanguageSelector />
			</div>

			{/* Content area */}
			<main className='flex-1 py-6 px-4 lg:px-8 max-w-7xl mx-auto w-full'>
				{/* Agency Earnings Summary */}
				<motion.div 
					className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<Wallet className="mx-auto mb-2 text-white" size={32} />
							<h3 className="text-3xl font-bold text-white">₹{earningData?.totalEarnings || 0}</h3>
							<p className="text-sm font-semibold text-blue-100">Total Earned</p>
						</div>
						<div className="text-center">
							<CheckCircle className="mx-auto mb-2 text-white" size={32} />
							<h3 className="text-3xl font-bold text-white">₹{earningData?.periodEarnings || 0}</h3>
							<p className="text-sm font-semibold text-blue-100">This Month</p>
						</div>
						<div className="text-center">
							<Clock className="mx-auto mb-2 text-white" size={32} />
							<h3 className="text-3xl font-bold text-white">{earningData?.tasksCompleted || 0}</h3>
							<p className="text-sm font-semibold text-blue-100">Tasks Completed</p>
						</div>
					</div>
					<div className="text-center mt-4 pt-4 border-t border-blue-400">
						<p className="text-blue-100 text-sm">Period: <span className="font-semibold">{earningData?.period || 'month'}</span></p>
					</div>
				</motion.div>

				{/* Quick Stats */}
				<motion.div
					className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.2 }}
				>
					<div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
						<h4 className="text-2xl font-bold text-[#00E0B8]">{earningData?.totalTasksCompleted || 0}</h4>
						<p className="text-sm text-gray-400">Tasks Done</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
						<h4 className="text-2xl font-bold text-yellow-400">{earningData?.tasksCompleted || 0}</h4>
						<p className="text-sm text-gray-400">Period Tasks</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
						<h4 className="text-2xl font-bold text-blue-400">₹{earningData?.periodEarnings || 0}</h4>
						<p className="text-sm text-gray-400">Period Earnings</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
						<h4 className="text-2xl font-bold text-purple-400">₹{earningData?.totalEarnings || 0}</h4>
						<p className="text-sm text-gray-400">Total Earnings</p>
					</div>
				</motion.div>

				{/* Recent Payments */}
				<motion.div
					className="bg-gray-900 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<div className="flex justify-between items-center mb-6">
						<div>
							<h2 className='text-xl font-semibold text-gray-100'>Recent Earnings</h2>
							<p className='text-sm text-gray-400 mt-1'>Your latest healthcare service earnings</p>
						</div>
					</div>

					{/* Payment Cards */}
					<div className='space-y-4'>
						{recentEarnings.map((earning) => (
							<motion.div
								key={earning.id}
								className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-[#00E0B8] transition-colors"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="flex justify-between items-start mb-3">
									<div className="flex items-center gap-3">
										<div className='h-10 w-10 rounded-full bg-gradient-to-r from-[#00E0B8] to-[#00C4A0] flex items-center justify-center text-gray-900 font-bold'>
											{(earning.customerName || 'C').charAt(0)}
										</div>
										<div>
											<h3 className="font-semibold text-white">{earning.customerName || 'Customer'}</h3>
											<p className="text-[#00E0B8] text-sm">{earning.serviceName}</p>
										</div>
									</div>
									<div className="text-right">
										<div className="text-xl font-bold text-green-400">₹{earning.totalAmount}</div>
										<div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
											✓ Completed
										</div>
									</div>
								</div>

								<div className="bg-gray-700 rounded-lg p-3 mb-3">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-gray-400">Completed:</span>
											<span className="text-white ml-2">{earning.completedAt ? new Date(earning.completedAt).toLocaleDateString() : 'N/A'}</span>
										</div>
										<div>
											<span className="text-gray-400">Rating:</span>
											<span className="text-yellow-400 ml-2">{earning.customerRating ? `${earning.customerRating}/5 ⭐` : 'Not rated'}</span>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-400">
									<div className="flex items-center gap-2">
										<Calendar size={14} />
										<span>Date: {earning.preferredDate}</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin size={14} />
										<span>{earning.city || earning.fullAddress}</span>
									</div>
									<div className="flex items-center gap-2">
										<Phone size={14} />
										<span>{earning.phone}</span>
									</div>
								</div>
							</motion.div>
						))}
					</div>

					{/* View All Button */}
					<div className="text-center mt-6">
						<button className="bg-[#00E0B8] hover:bg-[#00C4A0] text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
							View All Earnings
						</button>
					</div>
				</motion.div>
			</main>
		</div>
	);
};
export default EarningPage;
