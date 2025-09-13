import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, MapPin, Phone, Receipt, Eye, Calendar, DollarSign } from "lucide-react";

const userData = [
	{ 
		id: 1, 
		name: "Mrs. Sharma", 
		email: "sharma@email.com", 
		phone: "+91-9876543210",
		service: "Elderly Care",
		completionDate: "2025-01-14", 
		completionTime: "4:30 PM",
		duration: "6 hours",
		location: "Koramangala, Bangalore",
		amountEarned: "₹3,500",
		paymentStatus: "paid",
		paymentMethod: "UPI",
		customerRating: 5,
		customerFeedback: "Excellent care for my mother. Very professional and caring.",
		serviceNotes: "Assisted with daily activities, medication reminders, and mobility support."
	},
	{ 
		id: 2, 
		name: "Rajesh Kumar", 
		email: "rajesh@email.com", 
		phone: "+91-8765432109",
		service: "Diabetes Management",
		completionDate: "2025-01-13", 
		completionTime: "6:00 PM",
		duration: "4 hours",
		location: "Whitefield, Bangalore",
		amountEarned: "₹2,200",
		paymentStatus: "paid",
		paymentMethod: "Cash",
		customerRating: 4,
		customerFeedback: "Good service, helped with blood sugar monitoring.",
		serviceNotes: "Blood glucose monitoring, insulin administration, diet guidance."
	},
	{ 
		id: 3, 
		name: "Dr. Priya Nair", 
		email: "priya@email.com", 
		phone: "+91-7654321098",
		service: "Post Surgery Care",
		completionDate: "2025-01-12", 
		completionTime: "2:00 PM",
		duration: "3 hours",
		location: "Indiranagar, Bangalore",
		amountEarned: "₹4,200",
		paymentStatus: "pending",
		paymentMethod: "Bank Transfer",
		customerRating: 5,
		customerFeedback: "Outstanding post-operative care. Highly recommended!",
		serviceNotes: "Wound dressing, medication administration, mobility assistance."
	},
	{ 
		id: 4, 
		name: "Sunita Reddy", 
		email: "sunita@email.com", 
		phone: "+91-5432109876",
		service: "Physiotherapy",
		completionDate: "2025-01-11", 
		completionTime: "5:30 PM",
		duration: "2.5 hours",
		location: "Jayanagar, Bangalore",
		amountEarned: "₹1,800",
		paymentStatus: "paid",
		paymentMethod: "UPI",
		customerRating: 4,
		customerFeedback: "Very helpful with knee exercises. Professional approach.",
		serviceNotes: "Knee rehabilitation exercises, pain management techniques."
	},
	{ 
		id: 5, 
		name: "Amit Patel", 
		email: "amit@email.com", 
		phone: "+91-4321098765",
		service: "Nursing Care",
		completionDate: "2025-01-10", 
		completionTime: "8:00 PM",
		duration: "8 hours",
		location: "HSR Layout, Bangalore",
		amountEarned: "₹6,800",
		paymentStatus: "paid",
		paymentMethod: "Cash",
		customerRating: null,
		customerFeedback: null,
		serviceNotes: "24-hour nursing care, medication management, patient monitoring."
	}
];

const TaskHistoryTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) => 
				user.name.toLowerCase().includes(term) || 
				user.email.toLowerCase().includes(term) ||
				user.service.toLowerCase().includes(term) ||
				user.location.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

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
										{task.name.charAt(0)}
									</div>
									<div>
										<h3 className="text-lg font-semibold text-white">{task.name}</h3>
										<p className="text-[#00E0B8] font-medium">{task.service}</p>
									</div>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold text-green-400">{task.amountEarned}</div>
									<div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
										task.paymentStatus === 'paid' 
											? 'bg-green-600 text-white' 
											: 'bg-yellow-600 text-white'
									}`}>
										<DollarSign size={12} className="mr-1" />
										{task.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
									</div>
								</div>
							</div>

							{/* Task details grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div className="flex items-center gap-2 text-gray-400">
									<Calendar size={16} />
									<span>{task.completionDate} at {task.completionTime}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-400">
									<Clock size={16} />
									<span>Duration: {task.duration}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-400">
									<MapPin size={16} />
									<span>{task.location}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-400">
									<Phone size={16} />
									<span>{task.phone}</span>
								</div>
							</div>

							{/* Service notes */}
							<div className="bg-gray-700 rounded-lg p-3 mb-4">
								<p className="text-sm text-gray-300">
									<span className="font-medium text-gray-200">Service Notes:</span> {task.serviceNotes}
								</p>
							</div>

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
									<span className="font-medium">Payment:</span> {task.paymentMethod}
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
