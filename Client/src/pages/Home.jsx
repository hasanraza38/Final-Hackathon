import React from 'react'
import Footer from '../components/Footer.jsx'
import { useNavigate } from 'react-router-dom'
import saylni_logo from '../assets/saylani_logo.png'

const Home = () => {
  const navigate = useNavigate()
  
const navigateToLoanPage = () => navigate('/loan-page')
  return (
    <>
    {/* //Navbar */}
    <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0">
                  <img className="h-12 w-auto" src={saylni_logo} alt="Saylani Logo" />
                </div>
                <div>
                  <button onClick={navigateToLoanPage} className="bg-[#8dc63f] hover:bg-[#8ec63fee] text-white px-4 py-2 rounded-md text-sm font-medium">
                    Apply for Loan
                  </button>
                </div>
              </div>
            </div>
          </nav>
    {/* //Navbar */}
  

{/* hero section */}
<div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
               <span className="text-[#8dc63f]">Saylani</span> Microfinance
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Empowering communities through accessible financial solutions. Our microfinance program provides small loans
              to help individuals start businesses, support their families, and achieve financial independence.
            </p>
          </div>
        </div>
      </div>
              {/* hero section */}


     {/* services  */}
     <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#8dc63f] font-semibold tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Financial Solutions for Everyone
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We offer a variety of loan products designed to meet your specific needs.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Business Startup Loans */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#8dc63f] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Business Startup Loans</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Start your entrepreneurial journey with our affordable business startup loans. We provide the
                    capital you need to turn your business idea into reality.
                  </p>
                </div>
              </div>

              {/* Education Loans */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#8dc63f] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Education Loans</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Invest in your future with our education financing options. Our loans cover tuition fees, books, and
                    other educational expenses to help you achieve your academic goals.
                  </p>
                </div>
              </div>

              {/* Wedding Loans */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#8dc63f] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Wedding Loans</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Make your special day memorable without financial stress. Our wedding loans help cover venue costs,
                    catering, decorations, and other wedding expenses.
                  </p>
                </div>
              </div>

              {/* Home Construction Loans */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#8dc63f] text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Home Construction Loans</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Build your dream home with our flexible construction financing. Our loans cover material costs,
                    labor, and other expenses associated with home building projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* services  */}

{/* footer */}
    <Footer/>
{/* footer */}

    </>
  )
}

export default Home

