const LoanApplicationModal = ({ application, onClose, onApprove, onReject }) => {
  // Format currency for display
  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString()}`
  }

  // Check if application is in pending state
  const isPending = application.status === "pending"

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-[#8dc63f]">Application Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Application Status */}
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                application.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : application.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {application.status}
            </span>
          </div>

          {/* Applicant Information */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-3">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{application.userId?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{application.userId?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CNIC</p>
                <p className="font-medium">{application.userId?.cnic || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {application.address?.city || "N/A"}, {application.address?.country || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-3">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Loan Category</p>
                <p className="font-medium capitalize">{application.category || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subcategory</p>
                <p className="font-medium">{application.subcategory || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-medium">{formatCurrency(application.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Initial Deposit</p>
                <p className="font-medium">{formatCurrency(application.initialDeposit)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Period</p>
                <p className="font-medium">{application.loanPeriod} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Loan</p>
                <p className="font-medium">{formatCurrency(application.loanAmount - application.initialDeposit)}</p>
              </div>
            </div>
          </div>

          {/* Guarantor Information - if available */}
          {application.guarantors && application.guarantors.length > 0 && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 mb-3">Guarantor Information</h3>

              {application.guarantors.map((guarantor, index) => (
                <div key={index} className={index > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}>
                  <h4 className="text-sm font-medium mb-2">Guarantor {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{guarantor.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CNIC</p>
                      <p className="font-medium">{guarantor.cnic || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{guarantor.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{guarantor.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
            {isPending && (
              <>
                <button
                  onClick={onReject}
                  className="px-6 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-medium"
                >
                  Reject Application
                </button>
                <button
                  onClick={onApprove}
                  className="px-6 py-2 bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white rounded-md font-medium"
                >
                  Approve Application
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanApplicationModal
