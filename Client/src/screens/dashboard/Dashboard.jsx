import React, { useEffect, useState } from "react";
import Nav from "../../components/navbar/Nav";
import { useForm } from "react-hook-form";
import {db, deleteDocument, getData, sendData } from "../../config/firebase/firebasemethods";
import { auth } from "../../config/firebase/firebasemethods";
import { onAuthStateChanged } from "firebase/auth";
import Footer from "../../components/footer/footer";
import { collection, getDoc } from "firebase/firestore";



function Dashboard() {
  const [dataArr, setDataArr] = useState([]);

 useEffect(()=>{
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      renderBlogs()
    }
  });
  
 },[])
 const renderBlogs = async () => {
  try {
    const blogs = await getData("blog's", auth.currentUser.uid);
    console.log(blogs);
    dataArr.push(blogs);
    setDataArr([...blogs])
  } catch (error) {
    console.error(error);
  }
};

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  



  const addBlogs = (data) => {
    
    const blogs = {
      title: data.title,
      blog: data.blog,
      uid: auth.currentUser.uid,
      
    };
    sendData(blogs, "blog's");
    renderBlogs();
    reset()
  };


  const deleteBlog = (index) => {
    const blogid = dataArr[index]

  
  console.log(blogid);
    
    // console.log("delete ", dataArr[index].id);
  }
     

  const editBlog = (index) => {
    console.log('edit' , index);

  }

  return (
    <div className="w-full h-full">
      <Nav />
      <div className="mx-10">
        <div className=" w-full ">
          <div className="mt-10 flex justify-center  items-center">
            <div className=" ">
              <h1 className="text-center text-3xl font-bold text-[#63ecdc]">
                Publish Blog
              </h1>
              {/*publish blog */}
              <div className="bg-[rgb(0,217,192)] p-8 rounded-2xl w-[50vw] shadow-zinc-500 shadow-lg mt-5">
                <form onSubmit={handleSubmit(addBlogs)}>
                  <div className="mb-4">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border-none shadow-lg shadow-zinc-700 bg-black rounded-md"
                      placeholder="Title"
                      {...register("title", { required: true, minLength: 4 })}
                    />
                    <br />
                    {errors.title && (
                      <span className="text-red-500 font-semibold">
                        Minimum Lenght 5
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <textarea
                      placeholder="Write Blog Here..."
                      className=" bg-black border-none shadow-lg shadow-zinc-700 textarea textarea-bordered textarea-md w-full "
                      defaultValue={""}
                      {...register("blog", { required: true, minLength: 14 })}
                    />
                    <br />
                    {errors.blog && (
                      <span className="text-red-500 font-semibold">
                        Minimum Lenght 15
                      </span>
                    )}
                  </div>
                  <div className=" mt-2 flex justify-center">
                    <button type="submit" className="btn btn-md  bg-black shadow-lg shadow-zinc-900 border-none text-[#72f1e3] ">
                      Publish Blog
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* My Blogs  */}
        <div className='mt-8'>
          <h1 className="font-sans text-3xl text-[#00D9C0] font-bold">
            My blogs{" "}
          </h1>
        </div>

        <div className="flex flex-col gap-6 h-full py-11 ">
          { dataArr ? dataArr.map((item , index) => {
            return (
              <>
                <div className=" p-5 rounded-2xl bg-[#00D9C0] w-[50vw] shadow-2xl  text-black">
                  <div className="flex gap-2">
                    <div className="avatar">
                      <div className="w-14 rounded">
                        <img
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          alt="Tailwind-CSS-Avatar-component"
                        />
                      </div>
                    </div>
                    <div>
                      <h1 className="font-sans text-md text-black font-semibold">
                        {item.title}
                      </h1>
                      <p className="text-zinc-700 font-medium">
                        Hasan raza-August 16
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-black font-medium">{item.blog}</p>
                  </div>
                  <div className="mt-5 flex gap-4">
                    <button onClick={() => deleteBlog(index)} className="border  border-red-500 rounded shadow-md shadow-red-700 px-2 text-black font-bold">
                      Delete
                    </button>
                    <button onClick={() => editBlog(index)} className="border-none rounded shadow-md shadow-zinc-900 px-2  text-black font-bold">
                      Edit
                    </button>
                  </div>
                </div>
              </>
            );
          }) : <h1 className="text-white text-center text-4xl my-5">loading...</h1>}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Dashboard;
