import { DollarSign, ClipboardList, Star, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import DashboardHeader from "../../components/common/DashboardHeader";
import StatCard from "../../components/common/StatCard";
import TaskHistoryTable from "../../components/CompletedTask/CompletedTaskHistoryTable";
import LanguageSelector from "../../components/common/LanguageSelector";



const taskStats = {
	totalTasksCompleted: 12,
	totalEarning: "₹18,500",
	clientRating: 4.7,
	cancelledTask: 2,
	weeklyEarnings: "₹4,200",
	monthlyEarnings: "₹18,500",
	topService: "Elderly Care",
	avgTaskDuration: "3.5 hours"
};

const CompletedTaskPage = () => {
	const { t } = useTranslation();
	
	return (
		<div className='flex-1 flex flex-col h-full'>
			{/* Header with language selector */}
			<div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
				<DashboardHeader title='Completed Tasks' />
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
							<h3 className="text-3xl font-bold text-gray-900">{taskStats.totalTasksCompleted}</h3>
							<p className="text-sm font-semibold text-gray-800">Total Tasks Completed</p>
						</div>
						<div className="text-center">
							<h3 className="text-3xl font-bold text-gray-900">{taskStats.totalEarning}</h3>
							<p className="text-sm font-semibold text-gray-800">Total Earnings</p>
						</div>
						<div className="text-center">
							<div className="flex items-center justify-center gap-1">
								<Star className="fill-yellow-600 text-yellow-600" size={24} />
								<h3 className="text-3xl font-bold text-gray-900">{taskStats.clientRating}</h3>
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
						value={taskStats.weeklyEarnings}
						color='#10B981'
					/>
					<StatCard
						name='Top Service'
						icon={ClipboardList}
						value={taskStats.topService}
						color='#6366F1'
					/>
					<StatCard
						name='Avg Duration'
						icon={Star}
						value={taskStats.avgTaskDuration}
						color='#F59E0B'
					/>
					<StatCard 
						name='Cancelled Tasks' 
						icon={XCircle} 
						value={taskStats.cancelledTask} 
						color='#EF4444' 
					/>
				</motion.div>

				<TaskHistoryTable />   
			</main>
		</div>
	);
};
export default CompletedTaskPage;
