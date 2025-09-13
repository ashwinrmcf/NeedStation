import { CheckCircle, Clock, DollarSign, Wallet, CreditCard, Calendar, Phone, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import DashboardHeader from "../../components/common/DashboardHeader";
import LanguageSelector from "../../components/common/LanguageSelector";

const EarningData = {
	pendingFromAgency: "₹4,200",
	receivedFromAgency: "₹18,500",
	totalEarned: "₹22,700",
	weeklyEarning: "₹5,800",
	monthlyEarning: "₹22,700",
	totalTasks: 12,
	pendingTasks: 2,
	nextPayoutDate: "January 20, 2025"
};

const recentEarnings = [
	{
		id: 1,
		customer: "Mrs. Sharma",
		service: "Elderly Care",
		earnings: "₹3,150",
		status: "paid",
		taskDate: "2025-01-14",
		payoutDate: "2025-01-15",
		paymentMethod: "Bank Transfer",
		location: "Koramangala",
		duration: "6 hours"
	},
	{
		id: 2,
		customer: "Rajesh Kumar",
		service: "Diabetes Management",
		earnings: "₹1,980",
		status: "paid",
		taskDate: "2025-01-13",
		payoutDate: "2025-01-15",
		paymentMethod: "Bank Transfer",
		location: "Whitefield",
		duration: "4 hours"
	},
	{
		id: 3,
		customer: "Dr. Priya Nair",
		service: "Post Surgery Care",
		earnings: "₹3,780",
		status: "pending",
		taskDate: "2025-01-12",
		payoutDate: "2025-01-20",
		paymentMethod: "Bank Transfer",
		location: "Indiranagar",
		duration: "3 hours"
	},
	{
		id: 4,
		customer: "Sunita Reddy",
		service: "Physiotherapy",
		earnings: "₹1,620",
		status: "paid",
		taskDate: "2025-01-11",
		payoutDate: "2025-01-15",
		paymentMethod: "Bank Transfer",
		location: "Jayanagar",
		duration: "2.5 hours"
	}
];

const EarningPage = () => {
	const { t } = useTranslation();

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
							<h3 className="text-3xl font-bold text-white">{EarningData.totalEarned}</h3>
							<p className="text-sm font-semibold text-blue-100">Total Earned</p>
						</div>
						<div className="text-center">
							<CheckCircle className="mx-auto mb-2 text-white" size={32} />
							<h3 className="text-3xl font-bold text-white">{EarningData.receivedFromAgency}</h3>
							<p className="text-sm font-semibold text-blue-100">Received from Agency</p>
						</div>
						<div className="text-center">
							<Clock className="mx-auto mb-2 text-white" size={32} />
							<h3 className="text-3xl font-bold text-white">{EarningData.pendingFromAgency}</h3>
							<p className="text-sm font-semibold text-blue-100">Pending from Agency</p>
						</div>
					</div>
					<div className="text-center mt-4 pt-4 border-t border-blue-400">
						<p className="text-blue-100 text-sm">Next Payout: <span className="font-semibold">{EarningData.nextPayoutDate}</span></p>
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
						<h4 className="text-2xl font-bold text-[#00E0B8]">{EarningData.totalTasks}</h4>
						<p className="text-sm text-gray-400">Tasks Done</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
						<h4 className="text-2xl font-bold text-yellow-400">{EarningData.pendingTasks}</h4>
						<p className="text-sm text-gray-400">Pending</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
						<h4 className="text-2xl font-bold text-blue-400">{EarningData.weeklyEarning}</h4>
						<p className="text-sm text-gray-400">This Week</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
						<h4 className="text-2xl font-bold text-purple-400">{EarningData.monthlyEarning}</h4>
						<p className="text-sm text-gray-400">This Month</p>
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
											{earning.customer.charAt(0)}
										</div>
										<div>
											<h3 className="font-semibold text-white">{earning.customer}</h3>
											<p className="text-[#00E0B8] text-sm">{earning.service}</p>
										</div>
									</div>
									<div className="text-right">
										<div className="text-xl font-bold text-green-400">{earning.earnings}</div>
										<div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
											earning.status === 'paid' 
												? 'bg-green-600 text-white' 
												: 'bg-yellow-600 text-white'
										}`}>
											{earning.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
										</div>
									</div>
								</div>

								<div className="bg-gray-700 rounded-lg p-3 mb-3">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-gray-400">Duration:</span>
											<span className="text-white ml-2">{earning.duration}</span>
										</div>
										<div>
											<span className="text-gray-400">Payout Date:</span>
											<span className="text-blue-400 ml-2">{earning.payoutDate}</span>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-400">
									<div className="flex items-center gap-2">
										<Calendar size={14} />
										<span>Task: {earning.taskDate}</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin size={14} />
										<span>{earning.location}</span>
									</div>
									<div className="flex items-center gap-2">
										<CreditCard size={14} />
										<span>{earning.paymentMethod}</span>
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
