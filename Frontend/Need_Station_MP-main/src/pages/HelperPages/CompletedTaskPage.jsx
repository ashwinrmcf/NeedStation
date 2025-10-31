import { DollarSign, ClipboardList, Star, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

import DashboardHeader from "../../components/common/DashboardHeader";
import StatCard from "../../components/common/StatCard";
import TaskHistoryTable from "../../components/CompletedTask/CompletedTaskHistoryTable";
import LanguageSelector from "../../components/common/LanguageSelector";



const CompletedTaskPage = () => {
	const { t } = useTranslation();
	const [taskStats, setTaskStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
	
	// Fetch dashboard stats
	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const workerId = localStorage.getItem('workerId');
				
				if (!workerId) {
					setError('Worker ID not found. Please log in again.');
					return;
				}
				
				const response = await axios.get(`${API_URL}/worker/dashboard/stats/${workerId}`);
				setTaskStats(response.data);
				setError(null);
			} catch (err) {
				console.error('Error fetching stats:', err);
				setError('Failed to load statistics');
			} finally {
				setLoading(false);
			}
		};
		
		fetchStats();
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
				<DashboardHeader title={t("completedTasks")} />
				<LanguageSelector />
			</div>

			{/* Content area */}
			<main className='flex-1 py-6 px-4 lg:px-8 max-w-7xl mx-auto w-full'>
				{/* Enhanced Performance Summary */}
				<motion.div 
					className="bg-gradient-to-r from-[#00E0B8] to-[#00C4A0] rounded-xl p-6 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<h3 className="text-3xl font-bold text-gray-900">{taskStats?.tasksCompleted || 0}</h3>
							<p className="text-sm font-semibold text-gray-800">Total Tasks Completed</p>
						</div>
						<div className="text-center">
							<h3 className="text-3xl font-bold text-gray-900">₹{taskStats?.totalEarnings || 0}</h3>
							<p className="text-sm font-semibold text-gray-800">Total Earnings</p>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center gap-1">
								<Star className="fill-yellow-600 text-yellow-600" size={24} />
								<h3 className="text-3xl font-bold text-gray-900">{taskStats?.averageRating?.toFixed(1) || 0}</h3>
							</div>
							<p className="text-sm font-semibold text-gray-800">Average Rating</p>
						</div>
					</div>
				</motion.div>

				{/* Detailed STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.2 }}
				>
					<StatCard
						name='Weekly Earnings'
						icon={DollarSign}
						value={`₹${taskStats?.weeklyEarnings || 0}`}
						color='#10B981'
					/>
					<StatCard
						name='Monthly Earnings'
						icon={DollarSign}
						value={`₹${taskStats?.monthlyEarnings || 0}`}
						color='#6366F1'
					/>
					<StatCard
						name='This Week'
						icon={ClipboardList}
						value={`${taskStats?.tasksThisWeek || 0} tasks`}
						color='#F59E0B'
					/>
					<StatCard 
						name='Total Ratings' 
						icon={Star} 
						value={taskStats?.totalRatings || 0} 
						color='#EF4444' 
					/>
				</motion.div>

				<TaskHistoryTable />   
			</main>
		</div>
	);
};
export default CompletedTaskPage;
