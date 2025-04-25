
import { useState, useEffect } from "react"
import api from "../services/api.js"

const AppointmentModal = ({ appointmentId, onClose }) => {
  const [appointment, setAppointment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch appointment details when the modal opens
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await api.get(`/appointment/singleappointment/${appointmentId}`)
        setAppointment(response.data)
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

  // Format date for display
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Token Number</p>
                  <p className="font-medium text-lg">{appointment.tokenNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status || "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(appointment.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{appointment.time || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Office Location</p>
                  <p className="font-medium">{appointment.officeLocation || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="font-medium">{formatDate(appointment.createdAt)}</p>
                </div>
              </div>

              {/* QR Code Section */}
              {appointment.qrCode && (
                <div className="mt-6 border-t border-gray-200 pt-6 flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-3">Appointment QR Code</h3>
                  <p className="text-sm text-gray-500 mb-4">Please show this QR code when you visit our office</p>
                  <div className="bg-white p-4 border border-gray-200 rounded-md">
                    <img
                      src={appointment.qrCode || "/placeholder.svg"}
                      alt="Appointment QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white rounded-md font-medium"
                >
                  Print Details
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-medium"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
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
