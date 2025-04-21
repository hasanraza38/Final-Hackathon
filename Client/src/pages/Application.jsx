import { useState } from "react"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

const ApplicationPage = () => {
  const [formData, setFormData] = useState({
    loanType: "",
    amount: "",
    duration: "",
    purpose: "",
    income: "",
    employment: "",
    address: "",
    city: "",
    idNumber: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.loanType) {
      newErrors.loanType = "Please select a loan type"
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    if (!formData.duration) {
      newErrors.duration = "Duration is required"
    }

    if (!formData.purpose) {
      newErrors.purpose = "Purpose is required"
    }

    if (!formData.income) {
      newErrors.income = "Income is required"
    }

    if (!formData.employment) {
      newErrors.employment = "Employment status is required"
    }

    if (!formData.address) {
      newErrors.address = "Address is required"
    }

    if (!formData.city) {
      newErrors.city = "City is required"
    }

    if (!formData.idNumber) {
      newErrors.idNumber = "ID number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        // In a real app, you would send this data to your backend
        // const response = await fetch('https://api.example.com/loan-applications', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        //   },
        //   body: JSON.stringify(formData)
        // })

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsSubmitted(true)
      } catch (error) {
        console.error("Error submitting application:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    window.location.href = "/loans"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Your loan application has been successfully submitted. Our team will review your application and contact
                you within 2-3 business days.
              </p>
              <div className="flex justify-center">
                <a
                  href="/dashboard"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Loan Application Form</h1>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label htmlFor="loanType" className="block text-gray-700 text-sm font-medium mb-2">
                      Loan Type *
                    </label>
                    <select
                      id="loanType"
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.loanType ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a loan type</option>
                      <option value="business">Business Loan</option>
                      <option value="education">Education Loan</option>
                      <option value="home">Home Improvement Loan</option>
                      <option value="emergency">Emergency Loan</option>
                    </select>
                    {errors.loanType && <p className="mt-1 text-red-500 text-xs">{errors.loanType}</p>}
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-gray-700 text-sm font-medium mb-2">
                      Loan Amount (Rs.) *
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.amount ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. 50000"
                    />
                    {errors.amount && <p className="mt-1 text-red-500 text-xs">{errors.amount}</p>}
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-gray-700 text-sm font-medium mb-2">
                      Loan Duration (Months) *
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.duration ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select duration</option>
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                    </select>
                    {errors.duration && <p className="mt-1 text-red-500 text-xs">{errors.duration}</p>}
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="purpose" className="block text-gray-700 text-sm font-medium mb-2">
                      Purpose of Loan *
                    </label>
                    <textarea
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.purpose ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Briefly describe why you need this loan"
                    ></textarea>
                    {errors.purpose && <p className="mt-1 text-red-500 text-xs">{errors.purpose}</p>}
                  </div>

                  <div>
                    <label htmlFor="income" className="block text-gray-700 text-sm font-medium mb-2">
                      Monthly Income (Rs.) *
                    </label>
                    <input
                      type="number"
                      id="income"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.income ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. 25000"
                    />
                    {errors.income && <p className="mt-1 text-red-500 text-xs">{errors.income}</p>}
                  </div>

                  <div>
                    <label htmlFor="employment" className="block text-gray-700 text-sm font-medium mb-2">
                      Employment Status *
                    </label>
                    <select
                      id="employment"
                      name="employment"
                      value={formData.employment}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.employment ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select status</option>
                      <option value="employed">Employed</option>
                      <option value="self-employed">Self-employed</option>
                      <option value="business-owner">Business Owner</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                    </select>
                    {errors.employment && <p className="mt-1 text-red-500 text-xs">{errors.employment}</p>}
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">
                      Residential Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Street address"
                    />
                    {errors.address && <p className="mt-1 text-red-500 text-xs">{errors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. Karachi"
                    />
                    {errors.city && <p className="mt-1 text-red-500 text-xs">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="idNumber" className="block text-gray-700 text-sm font-medium mb-2">
                      CNIC Number *
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.idNumber ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. 42201-1234567-8"
                    />
                    {errors.idNumber && <p className="mt-1 text-red-500 text-xs">{errors.idNumber}</p>}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ApplicationPage
