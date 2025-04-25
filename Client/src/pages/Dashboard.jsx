// import { useState, useEffect } from "react"
// import Navbar from "../components/Navbar.jsx"
// import Footer from "../components/Footer.jsx"
// import AppointmentModal from "../components/AppointmentModal.jsx"
// import api from "../services/api.js"
// import { isAuthenticated,  } from "../utils/auth.js"

// const DashboardPage = () => {
//   const [appointments, setAppointments] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
//   const [activeTab, setActiveTab] = useState("appointments")
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
//   const [showAppointmentModal, setShowAppointmentModal] = useState(false)

//   useEffect(() => {
//     const authStatus = isAuthenticated()
//     setIsLoggedIn(authStatus)

//     if (authStatus) {
//       // fetchApplications()
//       fetchAppointments()
//     } 
//   }, [])

  

//   const fetchAppointments = async () => {
//     setIsLoadingAppointments(true)
//     try {
//       const response = await api.get("/appointment/allappointments")
//       console.log(response.data.appointments);
//       setAppointments(response.data.appointments)

//     } catch (error) {
//       console.error("Error fetching appointments:", error)
//     } finally {
//       setIsLoadingAppointments(false)
//     }
//   }



//   const handleViewAppointment = (appointmentId) => {
//     setSelectedAppointmentId(appointmentId)
//     setShowAppointmentModal(true)
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return date.toLocaleDateString()
//   }

 

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Navbar isLoggedIn={isLoggedIn} />

//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
//             </div>

//             <div className="border-b">
//               <nav className="flex">
                
//                 <button
//                   onClick={() => setActiveTab("appointments")}
//                   className={`px-6 py-4 text-sm font-medium ${
//                     activeTab === "appointments"
//                       ? "border-b-2 border-green-500 text-green-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Appointments
//                 </button>
                
//               </nav>
//             </div>

//             <div className="p-6">
//               {activeTab === "appointments" && (
//                 <div>
//                   <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-lg font-semibold text-gray-900">My Appointments</h2>
//                     <button
//                       onClick={() => fetchAppointments()}
//                       className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
//                     >
//                       Refresh
//                     </button>
//                   </div>

//                   {isLoadingAppointments ? (
//                     <div className="flex justify-center items-center h-64">
//                       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//                     </div>
//                   ) : appointments.length === 0 ? (
//                     <div className="text-center py-12 bg-gray-50 rounded-lg">
//                       <p className="text-gray-600 mb-4">You don't have any appointments yet.</p>
//                       <a
//                         href="/application"
//                         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
//                       >
//                         Apply for a Loan
//                       </a>
//                     </div>
//                   ) : (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Token Number
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Date & Time
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Location
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Status
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {appointments.map((appointment) => (
//                             <tr key={appointment._id} className="hover:bg-gray-50">
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                 {appointment.tokenNumber}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 <div>{formatDate(appointment.date)}</div>
//                                 <div className="text-xs">{appointment.time}</div>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {appointment.officeLocation}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <span
//                                   className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                     appointment.status === "completed"
//                                       ? "bg-green-100 text-green-800"
//                                       : appointment.status === "cancelled"
//                                         ? "bg-red-100 text-red-800"
//                                         : "bg-yellow-100 text-yellow-800"
//                                   }`}
//                                 >
//                                   {appointment.status || "Pending"}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                 <button
//                                   onClick={() => handleViewAppointment(appointment._id)}
//                                   className="text-green-600 hover:text-green-900"
//                                 >
//                                   View Details
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </main>

//       {showAppointmentModal && selectedAppointmentId && (
//         <AppointmentModal
//           appointmentId={selectedAppointmentId}
//           onClose={() => {
//             setShowAppointmentModal(false)
//             setSelectedAppointmentId(null)
//           }}
//         />
//       )}

//       <Footer />
//     </div>
//   )
// }

// export default DashboardPage







import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AppointmentModal from "../components/AppointmentModal.jsx";
import api from "../services/api.js";
import { isAuthenticated } from "../utils/auth.js";

const Dashboard = () => {
  const [activeTab] = useState("appointments");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)
  const [appointments, setAppointments] = useState([])

  


  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);
    if (authStatus) {
            fetchAppointments()
          } 
  }, []);

  
  // Fetch appointments data
  const fetchAppointments = async () => {
        setIsLoadingAppointments(true)
        try {
          const response = await api.get("/appointment/allappointments")
          // const data = Array.isArray(response.data) ? response.data : [];
          setAppointments(response.data.appointments)
          console.log(response.data);
          
        } catch (error) {
          console.error("Error fetching appointments:", error)
        } finally {
          setIsLoadingAppointments(false)
        }
      }

  

  const handleViewAppointment = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowAppointmentModal(true);
  };

  const handleCloseModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointmentId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
 

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn}  />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            </div>

            <div className="p-6">
              {/* Show only appointments content */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">My Appointments</h2>
                  <button
                    onClick={() => fetchAppointments()}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#8dc63f] hover:bg-[#7ab52e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8dc63f]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>

                {isLoadingAppointments ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8dc63f]"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">You don't have any scheduled appointments.</p>
                    <a
                      href="/book-appointment"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#8dc63f] hover:bg-[#7ab52e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8dc63f]"
                    >
                      Book an Appointment
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Desktop view (table) */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Token Number
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Loan Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {appointments.map((appointment) => (
                            <tr key={appointment._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {appointment.tokenNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {appointment.loanId?.category || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(appointment.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {appointment.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {appointment.officeLocation}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                   className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    appointment.loanId.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : appointment.loanId.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {appointment.loanId.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleViewAppointment(appointment._id)}
                                  className="text-[#8dc63f] hover:text-[#7ab52e]"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile view (cards) */}
                    <div className="md:hidden space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment._id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                          <div className="p-4 border-b">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium text-gray-900">{appointment.tokenNumber}</h3>
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full `}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Loan Category:</span>
                              <span className="text-sm font-medium text-gray-900">{appointment.loanId?.category || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Date:</span>
                              <span className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Time:</span>
                              <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Location:</span>
                              <span className="text-sm font-medium text-gray-900">{appointment.officeLocation}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 border-t text-right">
                            <button
                              onClick={() => handleViewAppointment(appointment._id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-[#8dc63f] bg-[#8dc63f]/10 hover:bg-[#8dc63f]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8dc63f]"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showAppointmentModal && selectedAppointmentId && (
        <AppointmentModal
          appointmentId={selectedAppointmentId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
