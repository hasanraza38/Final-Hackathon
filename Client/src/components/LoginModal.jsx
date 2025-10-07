import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import api from "../services/api.js"

const LoginModal = ({ onClose, onLogin, onSwitchToSignup, fromSignup = false }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState(fromSignup)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    if (signupSuccess) {
      const timer = setTimeout(() => {
        setSignupSuccess(false)
      }, 15000) 

      return () => clearTimeout(timer)
    }
  }, [signupSuccess])


      const onSubmit = async (data) => {
  setIsLoading(true);
  setApiError("");

  try {
    const response = await api.post("/auth/login", data);
    const { role } = response.data;

    if (role === "admin") {
      window.location.href = "/admin-panel";
      return;
    }

    onLogin(response.data);
  } catch (error) {
    console.error("Login error:", error);

    let message = "Something went wrong. Please try again.";

    if (error.response) {
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
    } else if (error.request) {
      message = "No response from server. Please check your internet connection.";
    } else {
      message = error.message || "Unexpected error occurred.";
    }

    setApiError(message);
  } finally {
    setIsLoading(false);
  }
       };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-[#8dc63f]">Login</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{apiError}</div>
        )}

        {signupSuccess && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            Account created successfully! Please login with your credentials.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
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
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8dc63f] ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-red-500 text-xs">{errors.password.message}</p>}
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#8dc63f] hover:bg-[#8ec63fc4] text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8dc63f] ${
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
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-[#8dc63f] hover:text-[#8ec63fd4] font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
