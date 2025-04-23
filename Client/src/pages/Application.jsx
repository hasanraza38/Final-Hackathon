import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import api from "../services/api"
import { isAuthenticated, getUserFromCookies } from "../utils/auth"

const ApplicationPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [guarantors, setGuarantors] = useState([
    { name: "", cnic: "", email: "", phone: "" },
    { name: "", cnic: "", email: "", phone: "" },
  ])
  const [loanCategories, setLoanCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [subcategories, setSubcategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

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

  // Watch the category to update subcategories
  const watchedCategory = watch("category")

  useEffect(() => {
    // Check authentication status when component mounts
    const authStatus = isAuthenticated()
    setIsLoggedIn(authStatus)

    if (authStatus) {
      // Get user data if authenticated
      setUserData(getUserFromCookies())
    } else {
      // Redirect to loans page if not authenticated
      window.location.href = "/loans"
    }

    // Fetch loan categories
    fetchLoanCategories()
  }, [])

  useEffect(() => {
    // Update subcategories when category changes
    if (watchedCategory) {
      const category = loanCategories.find((cat) => cat.name === watchedCategory)
      if (category && category.subcategories) {
        setSubcategories(category.subcategories)
        // Reset subcategory selection
        setValue("subcategory", "")
      } else {
        setSubcategories([])
      }
    }
  }, [watchedCategory, loanCategories, setValue])

  const fetchLoanCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const response = await api.get("/admin/getcategories")
      if (response.data && Array.isArray(response.data)) {
        setLoanCategories(response.data)
      } else if (response.data && Array.isArray(response.data.data)) {
        setLoanCategories(response.data.data)
      } else {
        console.error("Unexpected API response format:", response.data)
        // Fallback to mock data
        setLoanCategories([
          {
            id: 1,
            name: "loan wedding",
            maxLoan: 500000,
            loanPeriod: 3,
            subcategories: ["Valima", "Furniture", "Food"],
          },
          {
            id: 2,
            name: "education loan",
            maxLoan: 300000,
            loanPeriod: 6,
            subcategories: ["Tuition", "Books", "Accommodation"],
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching loan categories:", error)
      // Fallback to mock data
      setLoanCategories([
        {
          id: 1,
          name: "loan wedding",
          maxLoan: 500000,
          loanPeriod: 3,
          subcategories: ["Valima", "Furniture", "Food"],
        },
        {
          id: 2,
          name: "education loan",
          maxLoan: 300000,
          loanPeriod: 6,
          subcategories: ["Tuition", "Books", "Accommodation"],
        },
      ])
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleGuarantorChange = (index, field, value) => {
    const updatedGuarantors = [...guarantors]
    updatedGuarantors[index][field] = value
    setGuarantors(updatedGuarantors)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      // Prepare the data in the format expected by the API
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

      // Submit loan application to API
      const response = await api.post("/loans", applicationData)

      // Store the response data
      setSubmissionResult(response.data)
    } catch (error) {
      console.error("Error submitting application:", error)

      // Handle different types of errors
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
      <Navbar isLoggedIn={isLoggedIn} userData={userData} onLogout={handleLogout} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          {submissionResult ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{submissionResult.message}</h2>

              <div className="mt-6 bg-gray-50 p-6 rounded-lg text-left">
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
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Loan Application Form</h1>

              {apiError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{apiError}</div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div>
                    <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register("city", { required: "City is required" })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. Karachi"
                    />
                    {errors.city && <p className="mt-1 text-red-500 text-xs">{errors.city.message}</p>}
                  </div>

                  <div className="col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Guarantor Information</h3>
                    <p className="text-sm text-gray-500 mb-4">Please provide details of two guarantors</p>

                    {guarantors.map((guarantor, index) => (
                      <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
                        <h4 className="font-medium mb-3">Guarantor {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
