
import { useState, useEffect } from "react"
import api from "../services/api.js"

const AppointmentModal = ({ appointmentId, onClose }) => {
  const [appointment, setAppointment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await api.get(`/appointment/singleappointment/${appointmentId}`)
        // console.log(response.data.appointment);
        setAppointment(response.data.appointment)
      } catch (err) {
        console.error("Error fetching appointment details:", err)
        setError("Failed to load appointment details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (appointmentId) {
      fetchAppointmentDetails()
    }
  }, [appointmentId])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString()}`
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-[#8dc63f]">Appointment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8dc63f]"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-50 rounded-md">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-medium"
              >
                Close
              </button>
            </div>
          ) : appointment ? (

            <>
              {/* Application Status */}
              <div className="mb-6 flex justify-between items-center" >
                <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
                <span
                  className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${appointment.loanId.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : appointment.loanId.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {appointment.loanId.status}
                </span>
              </div>

              {/* Loan Details */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-3">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Loan Category</p>
                <p className="font-medium capitalize">{appointment.loanId.category || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subcategory</p>
                <p className="font-medium">{appointment.loanId.subcategory || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-medium">{formatCurrency(appointment.loanId.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Initial Deposit</p>
                <p className="font-medium">{formatCurrency(appointment.loanId.initialDeposit)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Period</p>
                <p className="font-medium">{appointment.loanId.loanPeriod} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Loan</p>
                <p className="font-medium">{formatCurrency(appointment.loanId.loanAmount - appointment.loanId.initialDeposit)}</p>
              </div>
            </div>
          </div>

 {/* Appointment Details */}

             <div className="text-center py-8">
              <div className="mt-6 bg-gray-50 p-6 rounded-lg text-left">
                <div className=" pt-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-6">
                  <p className="text-sm text-gray-500">Token Number</p>
                  <p className="font-medium">{appointment.tokenNumber}</p>
                </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(appointment?.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{appointment?.time || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{appointment?.officeLocation || "N/A"}</p>
                    </div>
                  </div>
                </div>
                {/* qr Code  */}
                {appointment.qrCode && (
                  <div className="border-t border-gray-200 pt-4 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-3">Appointment QR Code</h3>
                    <p className="text-sm text-gray-500 mb-4">Please show this QR code when you visit our office</p>
                    <img
                      src={appointment.qrCode || "/placeholder.svg"}
                      alt="Appointment QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
                >
                  Print Details
                </button>
              </div>
            </div>
            </>
              )
          : (
            <div className="text-center p-6">
              <p className="text-gray-600">No appointment details found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal













