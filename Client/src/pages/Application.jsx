import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import api from "../services/api.js"
import { isAuthenticated,  } from "../utils/auth.js"


const ApplicationPage = () => {
// states
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [installmentAmount, setInstallmentAmount] = useState(0)
  const [guarantors, setGuarantors] = useState([
    { name: "", cnic: "", email: "", phone: "", address: { city: "", country: "Pakistan" } },
    { name: "", cnic: "", email: "", phone: "", address: { city: "", country: "Pakistan" } },
  ])
  const [loanCategories, setLoanCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
// states

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "",
      subcategory: "",
      loanAmount: "",
      initialDeposit: "",
      loanPeriod: "",
      city: "",
      country: "Pakistan",
    },
  })

  const watchedCategory = watch("category")
  const watchedLoanAmount = watch("loanAmount")
  const watchedInitialDeposit = watch("initialDeposit")
  const watchedLoanPeriod = watch("loanPeriod")

  useEffect(() => {
    const authStatus = isAuthenticated()
    setIsLoggedIn(authStatus)

    fetchLoanCategories()
  }, [])

  useEffect(() => {
    if (watchedCategory) {
      const category = loanCategories.find((cat) => cat.name === watchedCategory)
      if (category && category.subcategories) {
        setSubcategories(category.subcategories)
        setValue("subcategory", "")
      } else {
        setSubcategories([])
      }
    }
  }, [watchedCategory, loanCategories, setValue])

  useEffect(() => {
    if (watchedLoanAmount && watchedInitialDeposit && watchedLoanPeriod) {
      const amount = calculateInstallment(watchedLoanAmount, watchedInitialDeposit, watchedLoanPeriod)
      setInstallmentAmount(amount)
    }
  }, [watchedLoanAmount, watchedInitialDeposit, watchedLoanPeriod])

  // calculate installment amount
  const calculateInstallment = (loanAmount, initialDeposit, loanPeriod) => {
    if (!loanAmount || !loanPeriod) return 0

    const installment = Number(loanAmount) - Number(initialDeposit)
    return installment / Number(loanPeriod)
  }
  // calculate installment amount


 
  const fetchLoanCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const response = await api.get("/admin/getcategories")

      if (response.data && Array.isArray(response.data)) {
        setLoanCategories(response.data)
        console.log("1",response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        // Some APIs nest data in a data property
        setLoanCategories(response.data.data)
        console.log("2",response.data);
      } else {
        console.error("Unexpected API response format:", response.data)
        // Fallback to mock data if response format is unexpected
      }
      console.log(response.data);
      
    } 
    catch (error) {
      console.error("Error fetching loan categories:", error)
    } finally {
      setIsLoadingCategories(false)
    }
  }


  const handleGuarantorChange = (index, field, value, isAddress = false) => {
    const updatedGuarantors = [...guarantors]

    if (isAddress) {
      updatedGuarantors[index].address[field] = value
    } else {
      updatedGuarantors[index][field] = value
    }

    setGuarantors(updatedGuarantors)
  }

 
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      const applicationData = {
        category: data.category,
        subcategory: data.subcategory,
        loanAmount: data.loanAmount,
        initialDeposit: data.initialDeposit,
        loanPeriod: data.loanPeriod,
        guarantors: guarantors,
        address: {
          city: data.city,
          country: data.country,
        },
      }

      const response = await api.post("/loans", applicationData)
      setSubmissionResult(response.data)

    } catch (error) {
      console.error("Error submitting application:", error)

      if (error.response) {
        setApiError(error.response.data.message || "Failed to submit application. Please try again.")
      } else if (error.request) {
        setApiError("No response from server. Please try again later.")
      } else {
        setApiError("An error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  


  const formatAppointmentDate = (dateString) => {
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn}  />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Success view - shown after successful submission */}
          {submissionResult ? (
            <div className="text-center py-8">
              {/* Success icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{submissionResult.message}</h2>

              {/* Application details section */}
              <div className="mt-6 bg-gray-50 p-6 rounded-lg text-left">
                {/* Loan ID and Token Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Loan ID</p>
                    <p className="font-medium">{submissionResult.loanId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Token Number</p>
                    <p className="font-medium">{submissionResult.tokenNumber}</p>
                  </div>
                </div>

                {/* Appointment details section */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatAppointmentDate(submissionResult.appointment?.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{submissionResult.appointment?.time || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{submissionResult.appointment?.officeLocation || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code section */}
                {submissionResult.qrCode && (
                  <div className="border-t border-gray-200 pt-4 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-3">Appointment QR Code</h3>
                    <p className="text-sm text-gray-500 mb-4">Please show this QR code when you visit our office</p>
                    <img
                      src={submissionResult.qrCode || "/placeholder.svg"}
                      alt="Appointment QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
                <a
                  href="/dashboard"
                  className="bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white px-6 py-2 rounded-md text-sm font-medium"
                >
                  Go to Dashboard
                </a>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
                >
                  Print Details
                </button>
              </div>
            </div>
          ) : (
            /* Application form - shown before submission */
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Loan Application Form</h1>

              {/* API error message */}
              {apiError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{apiError}</div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Loan Category selection */}
                  <div className="col-span-2">
                    <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-2">
                      Loan Category *
                    </label>
                    <select
                      id="category"
                      {...register("category", { required: "Please select a loan category" })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isLoadingCategories}
                    >
                      <option value="">Select a loan category</option>
                      {loanCategories.map((category) => (
                        <option key={category.id || category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-red-500 text-xs">{errors.category.message}</p>}
                  </div>

                  {/* Subcategory selection */}
                  <div className="col-span-2">
                    <label htmlFor="subcategory" className="block text-gray-700 text-sm font-medium mb-2">
                      Subcategory *
                    </label>
                    <select
                      id="subcategory"
                      {...register("subcategory", { required: "Please select a subcategory" })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                        errors.subcategory ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={!watchedCategory || subcategories.length === 0}
                    >
                      <option value="">Select a subcategory</option>
                      {subcategories.map((subcategory, index) => (
                        <option key={index} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                    </select>
                    {errors.subcategory && <p className="mt-1 text-red-500 text-xs">{errors.subcategory.message}</p>}
                  </div>

                  {/* Loan Amount input */}
                  <div>
                    <label htmlFor="loanAmount" className="block text-gray-700 text-sm font-medium mb-2">
                      Loan Amount (Rs.) *
                    </label>
                    <input
                      type="number"
                      id="loanAmount"
                      {...register("loanAmount", {
                        required: "Amount is required",
                        min: { value: 1000, message: "Minimum amount is Rs. 1,000" },
                        max: { value: 500000, message: "Maximum amount is Rs. 500,000" },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                        errors.loanAmount ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. 50000"
                    />
                    {errors.loanAmount && <p className="mt-1 text-red-500 text-xs">{errors.loanAmount.message}</p>}
                  </div>

                  {/* Initial Deposit input */}
                  <div>
                    <label htmlFor="initialDeposit" className="block text-gray-700 text-sm font-medium mb-2">
                      Initial Deposit (Rs.) *
                    </label>
                    <input
                      type="number"
                      id="initialDeposit"
                      {...register("initialDeposit", {
                        required: "Initial deposit is required",
                        min: { value: 0, message: "Minimum deposit is Rs. 0" },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                        errors.initialDeposit ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. 5000"
                    />
                    {errors.initialDeposit && (
                      <p className="mt-1 text-red-500 text-xs">{errors.initialDeposit.message}</p>
                    )}
                  </div>

                  {/* Loan Period selection */}
                  <div>
                    <label htmlFor="loanPeriod" className="block text-gray-700 text-sm font-medium mb-2">
                      Loan Period (Months) *
                    </label>
                    <select
                      id="loanPeriod"
                      {...register("loanPeriod", { required: "Loan period is required" })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                        errors.loanPeriod ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select period</option>
                      <option value="1">1 month</option>
                      <option value="2">2 months</option>
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                    </select>
                    {errors.loanPeriod && <p className="mt-1 text-red-500 text-xs">{errors.loanPeriod.message}</p>}
                  </div>

                  {/* City input - dropdown with specific cities */}
                  <div>
                    <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                      City *
                    </label>
                    <select
                      id="city"
                      {...register("city", { required: "City is required" })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a city</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                    {errors.city && <p className="mt-1 text-red-500 text-xs">{errors.city.message}</p>}
                  </div>

                  {/* Country input - disabled and set to Pakistan */}
                  <div>
                    <label htmlFor="country" className="block text-gray-700 text-sm font-medium mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      value="Pakistan"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
                    />
                  </div>

                  {/* Loan Calculator */}
                  <div className="col-span-2 mt-4 p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Loan Calculator</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="text-lg font-semibold">
                          Rs. {watchedLoanAmount ? Number(watchedLoanAmount).toLocaleString() : 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Initial Deposit</p>
                        <p className="text-lg font-semibold">
                          Rs. {watchedInitialDeposit ? Number(watchedInitialDeposit).toLocaleString() : 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Net Loan</p>
                        <p className="text-lg font-semibold">
                          Rs.{" "}
                          {watchedLoanAmount && watchedInitialDeposit
                            ? (Number(watchedLoanAmount) - Number(watchedInitialDeposit)).toLocaleString()
                            : 0}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-md border border-green-200">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-700">Monthly Installment:</p>
                        <p className="text-xl font-bold text-green-700">
                          Rs. {installmentAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on {watchedLoanPeriod || 0} month(s) repayment period
                      </p>
                    </div>
                  </div>

                  {/* Guarantor Information section */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Guarantor Information</h3>
                    <p className="text-sm text-gray-500 mb-4">Please provide details of two guarantors</p>

                    {/* Map through guarantors array to create input fields for each */}
                    {guarantors.map((guarantor, index) => (
                      <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
                        <h4 className="font-medium mb-3">Guarantor {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Guarantor Name */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
                            <input
                              type="text"
                              value={guarantor.name}
                              onChange={(e) => handleGuarantorChange(index, "name", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f]"
                              placeholder="e.g. John Doe"
                              required
                            />
                          </div>
                          {/* Guarantor CNIC */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">CNIC *</label>
                            <input
                              type="text"
                              value={guarantor.cnic}
                              onChange={(e) => handleGuarantorChange(index, "cnic", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f]"
                              placeholder="e.g. 4220112345678"
                              required
                            />
                          </div>
                          {/* Guarantor Email */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Email *</label>
                            <input
                              type="email"
                              value={guarantor.email}
                              onChange={(e) => handleGuarantorChange(index, "email", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f]"
                              placeholder="e.g. john@example.com"
                              required
                            />
                          </div>
                          {/* Guarantor Phone */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number *</label>
                            <input
                              type="tel"
                              value={guarantor.phone}
                              onChange={(e) => handleGuarantorChange(index, "phone", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f]"
                              placeholder="e.g. 03001234567"
                              required
                            />
                          </div>
                          {/* Guarantor City */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">City *</label>
                            <select
                              value={guarantor.address.city}
                              onChange={(e) => handleGuarantorChange(index, "city", e.target.value, true)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f]"
                              required
                            >
                              <option value="">Select a city</option>
                              <option value="Karachi">Karachi</option>
                              <option value="Lahore">Lahore</option>
                              <option value="Islamabad">Islamabad</option>
                              <option value="Hyderabad">Hyderabad</option>
                            </select>
                          </div>
                          {/* Guarantor Country - disabled and set to Pakistan */}
                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Country</label>
                            <input
                              type="text"
                              value="Pakistan"
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8dc63f] ${
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
