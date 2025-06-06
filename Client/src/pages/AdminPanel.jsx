import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import LoanApplicationModal from "../components/LoanApplicationModal.jsx"
import api from "../services/api.js"
import { isAuthenticated, isAdmin } from "../utils/auth.js"


const AdminPanel = () => {
  //  states
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [activeTab, setActiveTab] = useState("applications")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applications, setApplications] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showLoanApplicationModal, setShowLoanApplicationModal] = useState(false)
  const [subcategories, setSubcategories] = useState([""])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [newSubcategory, setNewSubcategory] = useState("")
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false)
  //  states

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isSubmittingCategory },
  } = useForm({
    defaultValues: {
      name: "",
      maxLoan: "",
      loanPeriod: "",
    },
  })

  useEffect(() => {
    checkAuth()
    fetchApplications()
    fetchCategories()
  }, [])

  
  const checkAuth = () => {
    const authStatus = isAuthenticated()
    setIsLoggedIn(authStatus)

    if (authStatus) {
      const adminStatus = isAdmin()
      setIsAdminUser(adminStatus)

      if (!adminStatus) {
        window.location.href = "/dashboard"
      }
    } else {
      window.location.href = "/loan-page"
    }
  }

  
  const fetchApplications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get("/admin/getAllApplications")
      setApplications(response.data)
    } catch (err) {
      console.error("Error fetching applications:", err)
      setError("Failed to load applications. Please try again.")

    } finally {
      setIsLoading(false)
    }
  }

  
  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/getcategories")
      setCategories(response.data)
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  
  const onAddCategory = async (data) => {
    try {
      const categoryData = {
        ...data,
        subcategories: subcategories.filter((sub) => sub.trim() !== ""),
      }

      await api.post("/admin/addcategory", categoryData)

      fetchCategories()

      reset()
      setSubcategories([""])

      alert("Category added successfully!")
    } catch (error) {
      console.error("Error adding category:", error)
      alert("Failed to add category. Please try again.")
    }
  }

  const handleViewApplication = async (applicationId) => {
    try {
      setIsLoading(true)
      const response = await api.get(`/loanapplication/${applicationId}`)
      setSelectedApplication(response.data)

      setShowLoanApplicationModal(true)
    } catch (error) {
      console.error("Error fetching application details:", error)
      alert("Failed to load application details. Please try again.")

      
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.put(`/admin/applications/${applicationId}/${newStatus.toLowerCase()}`)
      setApplications(applications.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app)))

      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus })
      }

      alert(`Application ${newStatus} successfully!`)

      setShowLoanApplicationModal(false)
      fetchApplications()
    } catch (error) {
      console.error(`Error ${newStatus} application:`, error)
      alert(`Failed to ${newStatus} application. Please try again.`)
    }
  }

  const handleEditCategory = (category) => {
    setSelectedCategory(category)
    setIsEditingCategory(true)
    reset({
      name: category.name,
      maxLoan: category.maxLoan,
      loanPeriod: category.loanPeriod,
    })
    setSubcategories(category.subcategories || [""])
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/admin/deletecategory/${categoryId}`)
        fetchCategories()
        alert("Category deleted successfully!")
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("Failed to delete category. Please try again.")
      }
    }
  }

  const handleUpdateCategory = async (data) => {
    try {
      const categoryData = {
        ...data,
        subcategories: subcategories.filter((sub) => sub.trim() !== ""),
      }

      await api.put(`/admin/editcategory/${selectedCategory._id}`, categoryData)
      fetchCategories()

      reset()
      setSubcategories([""])
      setSelectedCategory(null)
      setIsEditingCategory(false)

      alert("Category updated successfully!")
    } catch (error) {
      console.error("Error updating category:", error)
      alert("Failed to update category. Please try again.")
    }
  }

  const handleAddSubcategoryToExisting = async (categoryId) => {
    if (!newSubcategory.trim()) {
      alert("Please enter a subcategory name")
      return
    }

    try {
      await api.post(`/admin/addsubcategory/${categoryId}`, {
        subcategory: newSubcategory,
      })
      fetchCategories()

      setNewSubcategory("")
      setIsAddingSubcategory(false)

      alert("Subcategory added successfully!")
    } catch (error) {
      console.error("Error adding subcategory:", error)
      alert("Failed to add subcategory. Please try again.")
    }
  }

  const onSubmitCategory = async (data) => {
    if (isEditingCategory) {
      await handleUpdateCategory(data)
    } else {
      await onAddCategory(data)
    }
  }

  const cancelEditing = () => {
    setIsEditingCategory(false)
    setSelectedCategory(null)
    reset({
      name: "",
      maxLoan: "",
      loanPeriod: "",
    })
    setSubcategories([""])
  }

  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, ""])
  }

  
  const handleSubcategoryChange = (index, value) => {
    const updatedSubcategories = [...subcategories]
    updatedSubcategories[index] = value
    setSubcategories(updatedSubcategories)
  }

  
  const handleRemoveSubcategory = (index) => {
    if (subcategories.length > 1) {
      const updatedSubcategories = subcategories.filter((_, i) => i !== index)
      setSubcategories(updatedSubcategories)
    }
  }

  
  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString()}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn}  />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            {/* Tab Navigation */}
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
                  onClick={() => setActiveTab("categories")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "categories"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Loan Categories
                </button>
              </nav>
            </div>
            {/* Tab Navigation */}


            <div className="p-6">
              {activeTab === "applications" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Loan Applications</h2>
                    <button
                      onClick={() => fetchApplications()}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Refresh
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center p-6 bg-red-50 rounded-md">
                      <p className="text-red-600 mb-4">{error}</p>
                      <button
                        onClick={() => fetchApplications()}
                        className="bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Retry
                      </button>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No loan applications found.</p>
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
                              Applicant
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
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {applications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {app.userId?.name || "Unknown"}
                                    </div>
                                    <div className="text-sm text-gray-500">{app.userId?.email || "No email"}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 capitalize">{app.category}</div>
                                <div className="text-xs text-gray-500">{app.subcategory}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatCurrency(app.loanAmount)}</div>
                                <div className="text-xs text-gray-500">{app.loanPeriod} months</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    app.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : app.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleViewApplication(app._id)}
                                  className="text-[#8dc63f] hover:text-[#8ec63fc4] mr-4"
                                >
                                  View
                                </button>
                                {app.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateStatus(app._id, "approve")}
                                      className="text-green-600 hover:text-green-900 mr-4"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(app._id, "reject")}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}


              {activeTab === "categories" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                      {isEditingCategory ? "Edit Loan Category" : "Add New Loan Category"}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmitCategory)} className="bg-gray-50 p-6 rounded-lg">
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                          Category Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          {...register("name", { required: "Category name is required" })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="e.g. Business Loan"
                        />
                        {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="maxLoan" className="block text-gray-700 text-sm font-medium mb-2">
                          Maximum Loan Amount (Rs.) *
                        </label>
                        <input
                          id="maxLoan"
                          type="number"
                          {...register("maxLoan", {
                            required: "Maximum loan amount is required",
                            min: { value: 1000, message: "Minimum amount is Rs. 1,000" },
                          })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                            errors.maxLoan ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="e.g. 500000"
                        />
                        {errors.maxLoan && <p className="mt-1 text-red-500 text-xs">{errors.maxLoan.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="loanPeriod" className="block text-gray-700 text-sm font-medium mb-2">
                          Loan Period (Months) *
                        </label>
                        <input
                          id="loanPeriod"
                          type="number"
                          {...register("loanPeriod", {
                            required: "Loan period is required",
                            min: { value: 1, message: "Minimum period is 1 month" },
                          })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                            errors.loanPeriod ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="e.g. 12"
                        />
                        {errors.loanPeriod && <p className="mt-1 text-red-500 text-xs">{errors.loanPeriod.message}</p>}
                      </div>

                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Subcategories *</label>
                        <p className="text-xs text-gray-500 mb-2">Add at least one subcategory</p>

                        {subcategories.map((subcategory, index) => (
                          <div key={index} className="flex mb-2">
                            <input
                              type="text"
                              value={subcategory}
                              onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f]"
                              placeholder={`Subcategory ${index + 1}`}
                              required={index === 0}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveSubcategory(index)}
                              className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50"
                              disabled={subcategories.length === 1 && index === 0}
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleAddSubcategory}
                          className="mt-2 text-[#8dc63f] hover:text-[#8ec63fc4] text-sm font-medium"
                        >
                          + Add Another Subcategory
                        </button>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={isSubmittingCategory}
                          className={`flex-1 bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8dc63f] ${
                            isSubmittingCategory ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmittingCategory ? (
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
                              {isEditingCategory ? "Updating..." : "Adding..."}
                            </span>
                          ) : isEditingCategory ? (
                            "Update Category"
                          ) : (
                            "Add Category"
                          )}
                        </button>
                        {isEditingCategory && (
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Existing Categories</h2>

                    {categories.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No loan categories found.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {categories.map((category) => (
                          <div key={category._id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <h3 className="text-md font-medium text-gray-900 capitalize">{category.name}</h3>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category._id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-gray-500">Maximum Loan</p>
                                <p className="text-sm font-medium">{formatCurrency(category.maxLoan)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Loan Period</p>
                                <p className="text-sm font-medium">{category.loanPeriod} months</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500 mb-1">Subcategories:</p>
                                <button
                                  onClick={() => {
                                    setIsAddingSubcategory(category._id)
                                    setNewSubcategory("")
                                  }}
                                  className="text-[#8dc63f] hover:text-[#8ec63fc4] text-xs"
                                >
                                  + Add Subcategory
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {category.subcategories.map((sub, index) => (
                                  <span
                                    key={index}
                                    className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                              {isAddingSubcategory === category._id && (
                                <div className="mt-2 flex items-center">
                                  <input
                                    type="text"
                                    value={newSubcategory}
                                    onChange={(e) => setNewSubcategory(e.target.value)}
                                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8dc63f]"
                                    placeholder="New subcategory"
                                  />
                                  <button
                                    onClick={() => handleAddSubcategoryToExisting(category._id)}
                                    className="ml-2 px-3 py-1 bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white text-sm rounded-md"
                                  >
                                    Add
                                  </button>
                                  <button
                                    onClick={() => setIsAddingSubcategory(false)}
                                    className="ml-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showLoanApplicationModal && selectedApplication && (
        <LoanApplicationModal
          application={selectedApplication}
          onClose={() => setShowLoanApplicationModal(false)}
          onApprove={() => handleUpdateStatus(selectedApplication._id, "approved")}
          onReject={() => handleUpdateStatus(selectedApplication._id, "rejected")}
        />
      )}
    </div>
  )
}

export default AdminPanel

