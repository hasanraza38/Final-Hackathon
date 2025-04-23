// import React, { useState, useEffect } from 'react';
// import api from '../services/api';

// function Dashboard() {
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     category: '',
//     subcategory: '',
//     loanAmount: '',
//     initialDeposit: '',
//     loanPeriod: '',
//     guarantors: [{ name: '', email: '', location: '', cnic: '' }, { name: '', email: '', location: '', cnic: '' }],
//     address: { city: '', country: '' }
//   });
//   const [slip, setSlip] = useState(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const { data } = await api.get('/categories');
//       setCategories(data);
//     };
//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await api.post('/loans', formData);
//       setSlip(data);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Error submitting loan');
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl mb-4">Loan Application</h1>
//       {!slip ? (
//         <form onSubmit={handleSubmit}>
//           <select
//             className="border p-2 mb-2"
//             value={formData.category}
//             onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
//           >
//             <option value="">Select Category</option>
//             {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
//           </select>
//           {formData.category && (
//             <select
//               className="border p-2 mb-2"
//               value={formData.subcategory}
//               onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
//             >
//               <option value="">Select Subcategory</option>
//               {categories.find(cat => cat.name === formData.category)?.subcategories.map(sub => (
//                 <option key={sub} value={sub}>{sub}</option>
//               ))}
//             </select>
//           )}
//           <input
//             className="border p-2 mb-2"
//             type="number"
//             placeholder="Loan Amount"
//             value={formData.loanAmount}
//             onChange={e => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
//           />
//           <input
//             className="border p-2 mb-2"
//             type="number"
//             placeholder="Initial Deposit"
//             value={formData.initialDeposit}
//             onChange={e => setFormData({ ...formData, initialDeposit: Number(e.target.value) })}
//           />
//           <input
//             className="border p-2 mb-2"
//             type="number"
//             placeholder="Loan Period (years)"
//             value={formData.loanPeriod}
//             onChange={e => setFormData({ ...formData, loanPeriod: Number(e.target.value) })}
//           />
//           {formData.guarantors.map((g, i) => (
//             <div key={i} className="border p-2 mb-2">
//               <input
//                 className="border p-2 mb-2"
//                 placeholder="Guarantor Name"
//                 value={g.name}
//                 onChange={e => {
//                   const guarantors = [...formData.guarantors];
//                   guarantors[i].name = e.target.value;
//                   setFormData({ ...formData, guarantors });
//                 }}
//               />
//               <input
//                 className="border p-2 mb-2"
//                 placeholder="Guarantor Email"
//                 value={g.email}
//                 onChange={e => {
//                   const guarantors = [...formData.guarantors];
//                   guarantors[i].email = e.target.value;
//                   setFormData({ ...formData, guarantors });
//                 }}
//               />
//               <input
//                 className="border p-2 mb-2"
//                 placeholder="Guarantor Location"
//                 value={g.location}
//                 onChange={e => {
//                   const guarantors = [...formData.guarantors];
//                   guarantors[i].location = e.target.value;
//                   setFormData({ ...formData, guarantors });
//                 }}
//               />
//               <input
//                 className="border p-2 mb-2"
//                 placeholder="Guarantor CNIC"
//                 value={g.cnic}
//                 onChange={e => {
//                   const guarantors = [...formData.guarantors];
//                   guarantors[i].cnic = e.target.value;
//                   setFormData({ ...formData, guarantors });
//                 }}
//               />
//             </div>
//           ))}
//           <input
//             className="border p-2 mb-2"
//             placeholder="City"
//             value={formData.address.city}
//             onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
//           />
//           <input
//             className="border p-2 mb-2"
//             placeholder="Country"
//             value={formData.address.country}
//             onChange={e => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
//           />
//           <button className="bg-blue-500 text-white p-2">Submit</button>
//         </form>
//       ) : (
//         <div className="border p-4">
//           <h2 className="text-xl">Loan Slip</h2>
//           <p>Token Number: {slip.tokenNumber}</p>
//           <p>Appointment: {new Date(slip.appointment.date).toLocaleDateString()} at {slip.appointment.time}, {slip.appointment.officeLocation}</p>
//           <img src={slip.qrCode} alt="QR Code" />
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;



import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import api from "../services/api"
import { isAuthenticated,  } from "../utils/auth"

const DashboardPage = () => {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("applications")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Check authentication status
    const authStatus = isAuthenticated()
    setIsLoggedIn(authStatus)

    
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would fetch from your API
      // const response = await api.get('loans/my-applications')
      // const data = await response.json()

      // Mock data for demonstration
      const mockApplications = [
        {
          id: "APP123456",
          loanType: "Business Loan",
          amount: 50000,
          duration: 12,
          status: "Under Review",
          submittedDate: "2023-04-15",
          lastUpdated: "2023-04-16",
        },
        {
          id: "APP789012",
          loanType: "Education Loan",
          amount: 75000,
          duration: 24,
          status: "Approved",
          submittedDate: "2023-03-10",
          lastUpdated: "2023-03-20",
        },
      ]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setApplications(mockApplications)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching applications:", error)
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Call your logout endpoint to clear cookies
      await api.post("auth/logout")

      // Redirect to loans page after logout
      window.location.href = "/loans"
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            </div>

            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("applications")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "applications"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Loan Applications
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "profile"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  My Profile
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "documents"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Documents
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "applications" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">My Loan Applications</h2>
                    <a
                      href="/application"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      New Application
                    </a>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-4">You haven't submitted any loan applications yet.</p>
                      <a
                        href="/application"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Apply for a Loan
                      </a>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Application ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Loan Type
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Submitted
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {applications.map((app) => (
                            <tr key={app.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {app.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.loanType}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Rs. {app.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    app.status === "Approved"
                                      ? "bg-green-100 text-green-800"
                                      : app.status === "Rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.submittedDate}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href={`/application/${app.id}`} className="text-green-600 hover:text-green-900">
                                  View
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">My Profile</h2>
                  <p className="text-gray-600 mb-4">Update your personal information and preferences.</p>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-center text-gray-500">Profile settings will be available soon.</p>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">My Documents</h2>
                  <p className="text-gray-600 mb-4">Upload and manage your documents for loan applications.</p>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-center text-gray-500">Document management will be available soon.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardPage
