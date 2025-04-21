import { useState } from "react"
import { useForm } from "react-hook-form"
import api from '../services/api';


const SignupModal = ({ onClose, onSignup, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cnic:"",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Watch password for confirmation validation
  const password = watch("password")

  const onSubmit = async (data) => {
    
    setIsLoading(true)
    setApiError(null)

    try {
      const {...signupData } = data

      const response = await api.post("auth/register", signupData)
      // const response = await api.post('/auth/register', { cnic, email, fullName});
      // await api.post('/auth/register', { cnic, email, name });

      // Assuming the API returns a token and user data
      const { token, user } = response.data


      // Call the onSignup function passed from parent component
      onSignup(user)
    } catch (error) {
      console.error("Signup error:", error)

      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 409) {
          setApiError("This email is already registered. Please use a different email or login.")
        } else {
          setApiError(error.response.data.message || "Registration failed. Please try again.")
        }
      } else if (error.request) {
        // The request was made but no response was received
        setApiError("No response from server. Please try again later.")
      } else {
        // Something happened in setting up the request that triggered an Error
        setApiError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#8dc63f]">Create Account</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{apiError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullName", { required: true , minLength: 4})}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your Name"
            />
            {errors.fullName && <p className="mt-1 text-red-500 text-xs">{errors.fullName.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
              CNIC Number
            </label>
            <input
              type="number"
              id="cnic"
              {...register("cnic", {
                required: "CNIC number is required",
                pattern: {
                  minLength: 13,
                  maxLength: 13,
                  message: "Please enter a valid phone number",
                },
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                errors.cnic ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="1234512345671"
            />
            {errors.cnic && <p className="mt-1 text-red-500 text-xs">{errors.cnic.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                },
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-red-500 text-xs">{errors.password.message}</p>}
          </div>


          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="mt-1 text-red-500 text-xs">{errors.confirmPassword.message}</p>}
          </div>

      

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#8dc63f] hover:text-[#8ec63fd4] font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupModal
