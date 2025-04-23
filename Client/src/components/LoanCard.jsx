const LoanCard = ({ loan }) => {
  const { name = "Loan", maxLoan = 0, loanPeriod = 0, subcategories = [] } = loan || {}

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-[#8dc63f] py-3 px-4">
        <h3 className="text-xl font-semibold text-white capitalize">{name}</h3>
      </div>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-gray-500 text-sm">Maximum Loan</p>
            <p className="text-2xl font-bold text-gray-900">
              Rs. {typeof maxLoan === "number" ? maxLoan.toLocaleString() : maxLoan}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Loan Period</p>
            <p className="text-lg font-semibold text-gray-900">{loanPeriod} months</p>
          </div>
        </div>

        {Array.isArray(subcategories) && subcategories.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-2">Subcategories:</p>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((subcategory, index) => (
                <span key={index} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                  {subcategory}
                </span>
              ))}
            </div>
          </div>
        )}

        
      </div>
    </div>
  )
}

export default LoanCard
