import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Clock, CheckCircle, XCircle, AlertCircle, 
  Filter, Search, Calendar, MapPin, Phone, Mail,
  Star, MessageCircle, Receipt, Eye, Download
} from "lucide-react";

import DashboardHeader from "../../components/common/DashboardHeader";
import LanguageSelector from "../../components/common/LanguageSelector";

const UpcomingTaskPage = () => {
	const { t } = useTranslation();
	const [activeFilter, setActiveFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	// Sample task data with different statuses
	const [allTasks] = useState([
		{
			id: 1,
			customerName: "Mrs. Sharma",
			customerPhone: "+91-9876543210",
			customerEmail: "sharma@email.com",
			service: "Elderly Care",
			description: "Need assistance for elderly mother with daily activities",
			date: "2025-01-15",
			time: "10:00 AM",
			location: "Koramangala, Bangalore",
			status: "new",
			priority: "high",
			payment: "₹2,500"
		},
		{
			id: 2,
			customerName: "Rajesh Kumar",
			customerPhone: "+91-8765432109",
			customerEmail: "rajesh@email.com",
			service: "Diabetes Management",
			description: "Regular blood sugar monitoring and medication assistance",
			date: "2025-01-15",
			time: "2:00 PM",
			location: "Whitefield, Bangalore",
			status: "accepted",
			priority: "medium",
			payment: "₹1,800"
		},
		{
			id: 3,
			customerName: "Priya Nair",
			customerPhone: "+91-7654321098",
			customerEmail: "priya@email.com",
			service: "Post Surgery Care",
			description: "Post-operative care and wound dressing",
			date: "2025-01-16",
			time: "9:00 AM",
			location: "Indiranagar, Bangalore",
			status: "in-progress",
			priority: "high",
			payment: "₹3,200"
		},
		{
			id: 4,
			customerName: "Amit Patel",
			customerPhone: "+91-6543210987",
			customerEmail: "amit@email.com",
			service: "Physiotherapy",
			description: "Home physiotherapy sessions for knee recovery",
			date: "2025-01-14",
			time: "4:00 PM",
			location: "HSR Layout, Bangalore",
			status: "completed",
			priority: "low",
			payment: "₹2,000",
			completedDate: "2025-01-14",
			completedTime: "6:30 PM",
			duration: "2.5 hours",
			customerRating: 5,
			customerFeedback: "Excellent service! Very professional and caring.",
			earningsStatus: "paid",
			paymentMethod: "UPI",
			canReview: true
		},
		{
			id: 5,
			customerName: "Sunita Reddy",
			customerPhone: "+91-5432109876",
			customerEmail: "sunita@email.com",
			service: "Elderly Care",
			description: "Daily care assistance for elderly father",
			date: "2025-01-13",
			time: "8:00 AM",
			location: "Jayanagar, Bangalore",
			status: "completed",
			priority: "high",
			payment: "₹3,500",
			completedDate: "2025-01-13",
			completedTime: "4:00 PM",
			duration: "8 hours",
			customerRating: 4,
			customerFeedback: "Good service, very punctual and helpful.",
			earningsStatus: "pending",
			paymentMethod: "Cash",
			canReview: true
		},
		{
			id: 6,
			customerName: "Dr. Mehta",
			customerPhone: "+91-4321098765",
			customerEmail: "mehta@email.com",
			service: "Post Surgery Care",
			description: "Post-operative wound care and monitoring",
			date: "2025-01-12",
			time: "10:00 AM",
			location: "BTM Layout, Bangalore",
			status: "completed",
			priority: "high",
			payment: "₹4,200",
			completedDate: "2025-01-12",
			completedTime: "2:00 PM",
			duration: "4 hours",
			customerRating: null,
			customerFeedback: null,
			earningsStatus: "paid",
			paymentMethod: "Bank Transfer",
			canReview: false
		}
	]);

	const statusConfig = {
		new: { color: 'bg-blue-600', icon: AlertCircle, label: 'New Request' },
		accepted: { color: 'bg-yellow-600', icon: Clock, label: 'Accepted' },
		'in-progress': { color: 'bg-orange-600', icon: Clock, label: 'In Progress' },
		completed: { color: 'bg-green-600', icon: CheckCircle, label: 'Completed' },
		cancelled: { color: 'bg-red-600', icon: XCircle, label: 'Cancelled' }
	};

	const filteredTasks = allTasks.filter(task => {
		const matchesFilter = activeFilter === 'all' || task.status === activeFilter;
		const matchesSearch = task.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 task.service.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	const TaskCard = ({ task }) => {
		const StatusIcon = statusConfig[task.status].icon;
		
		return (
			<motion.div
				className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#00E0B8] transition-colors"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="flex justify-between items-start mb-4">
					<div>
						<h3 className="text-lg font-semibold text-white">{task.customerName}</h3>
						<p className="text-[#00E0B8] font-medium">{task.service}</p>
					</div>
					<div className={`px-3 py-1 rounded-full text-white text-sm flex items-center gap-2 ${statusConfig[task.status].color}`}>
						<StatusIcon size={16} />
						{statusConfig[task.status].label}
					</div>
				</div>

				<p className="text-gray-300 mb-4">{task.description}</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div className="flex items-center gap-2 text-gray-400">
						<Calendar size={16} />
						<span>{task.date} at {task.time}</span>
					</div>
					<div className="flex items-center gap-2 text-gray-400">
						<MapPin size={16} />
						<span>{task.location}</span>
					</div>
					<div className="flex items-center gap-2 text-gray-400">
						<Phone size={16} />
						<span>{task.customerPhone}</span>
					</div>
					<div className="flex items-center gap-2 text-gray-400">
						<Mail size={16} />
						<span>{task.customerEmail}</span>
					</div>
				</div>

				{/* Completed Task Additional Info */}
				{task.status === 'completed' && (
					<div className="border-t border-gray-700 pt-4 mt-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div className="text-sm text-gray-400">
								<span className="font-medium">Completed:</span> {task.completedDate} at {task.completedTime}
							</div>
							<div className="text-sm text-gray-400">
								<span className="font-medium">Duration:</span> {task.duration}
							</div>
							<div className="text-sm text-gray-400">
								<span className="font-medium">Payment:</span> 
								<span className={`ml-2 px-2 py-1 rounded text-xs ${
									task.earningsStatus === 'paid' 
										? 'bg-green-600 text-white' 
										: 'bg-yellow-600 text-white'
								}`}>
									{task.earningsStatus === 'paid' ? 'Paid' : 'Pending'}
								</span>
							</div>
							<div className="text-sm text-gray-400">
								<span className="font-medium">Method:</span> {task.paymentMethod}
							</div>
						</div>

						{/* Customer Rating & Feedback */}
						{task.customerRating && (
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
						)}

						{!task.customerRating && (
							<div className="bg-gray-700 rounded-lg p-3 mb-4 text-center">
								<MessageCircle className="mx-auto mb-2 text-gray-400" size={20} />
								<p className="text-sm text-gray-400">Waiting for customer feedback</p>
							</div>
						)}
					</div>
				)}

				<div className="flex justify-between items-center">
					<span className="text-green-400 font-semibold text-lg">{task.payment}</span>
					<div className="flex gap-2">
						{task.status === 'new' && (
							<>
								<button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
									Accept
								</button>
								<button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
									Decline
								</button>
							</>
						)}
						{task.status === 'accepted' && (
							<button className="bg-[#00E0B8] hover:bg-[#00C4A0] text-gray-900 px-4 py-2 rounded-lg transition-colors">
								Start Task
							</button>
						)}
						{task.status === 'in-progress' && (
							<button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
								Mark Complete
							</button>
						)}
						{task.status === 'completed' && (
							<>
								<button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2">
									<Eye size={16} />
									View Details
								</button>
								<button className="bg-[#00E0B8] hover:bg-[#00C4A0] text-gray-900 px-3 py-2 rounded-lg transition-colors flex items-center gap-2">
									<Receipt size={16} />
									Receipt
								</button>
							</>
						)}
					</div>
				</div>
			</motion.div>
		);
	};

	return (
		<div className='flex-1 flex flex-col h-full'>
			{/* Header with language selector */}
			<div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
				<DashboardHeader title="All Tasks" />
				<LanguageSelector />
			</div>

			{/* Content area */}
			<main className='flex-1 py-6 px-4 lg:px-8 max-w-7xl mx-auto w-full'>
				{/* Filters and Search */}
				<div className="mb-6 space-y-4">
					<div className="flex flex-col md:flex-row gap-4">
						{/* Search */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-3 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Search by customer name or service..."
								className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#00E0B8] focus:outline-none"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					{/* Status Filters */}
					<div className="flex flex-wrap gap-2">
						{['all', 'new', 'accepted', 'in-progress', 'completed'].map((status) => (
							<button
								key={status}
								onClick={() => setActiveFilter(status)}
								className={`px-4 py-2 rounded-lg font-medium transition-colors ${
									activeFilter === status
										? 'bg-[#00E0B8] text-gray-900'
										: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
								}`}
							>
								{status === 'all' ? 'All Tasks' : statusConfig[status]?.label || status}
							</button>
						))}
					</div>
				</div>

				{/* Task List */}
				<div className="space-y-4">
					{filteredTasks.length > 0 ? (
						filteredTasks.map((task) => (
							<TaskCard key={task.id} task={task} />
						))
					) : (
						<div className="text-center py-12">
							<AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
							<p className="text-gray-400 text-lg">No tasks found matching your criteria</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};
export default UpcomingTaskPage;

