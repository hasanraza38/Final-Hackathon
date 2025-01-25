import React from "react";
import Nav from "../../components/navbar/Nav";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../../config/firebase/firebasemethods";

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const loginUserFromFirebase = async (data) => {
    // console.log(data)
    try {
      const userLogin = await loginUser({
        email: data.email,
        password: data.password,
      });
      // console.log(userLogin);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Nav />

      <div className="flex justify-center items-center h-[90vh]">
        <div className="border  border-zinc-400 p-11 rounded-2xl shadow-lg shadow-[#43f7e2]">
          <h1 className="text-center font-bold text-white text-3xl">Login</h1>
          <form
            onSubmit={handleSubmit(loginUserFromFirebase)}
            className="flex justify-center flex-col items-center mt-8"
          >
            <div className="mb-4 w-80">
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
              <br />
              {errors.email && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="mb-6 w-80">
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your password"
                {...register("password", { required: true, minLength: 9 })}
              />
              <br />
              {errors.password && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            <div className=" mt-2 flex justify-center">
              <button className="btn btn-sm text-black bg-[#00D9C0] border-none px-5 py-1 hover:bg-[#00B5A2]">
                Login
              </button>
            </div>
            <div className="flex justify-center mt-2">
              <h1 className="text-white text-md">
                Not a user ?{" "}
                <span className="text-[#00D9C0] cursor-pointer">
                  <Link to="/register">Register</Link>
                </span>
              </h1>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
