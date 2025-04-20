const LoanCard = ({ loan }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="bg-green-600 py-3 px-4">
          <h3 className="text-xl font-semibold text-white">{loan.title}</h3>
        </div>
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm">Amount up to</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {loan.amount}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Duration</p>
              <p className="text-lg font-semibold text-gray-900">{loan.duration}</p>
            </div>
          </div>
  
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Interest Rate</p>
            <p className="text-lg font-semibold text-gray-900">{loan.interestRate}</p>
          </div>
  
          <p className="text-gray-600 mb-6">{loan.description}</p>
  
          <button className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-2 rounded-md font-medium transition-colors duration-300">
            View Details
          </button>
        </div>
      </div>
    )
  }
  
  export default LoanCard
  