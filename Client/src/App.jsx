import React, { useEffect, useState } from "react";
import Nav from "./components/navbar/Nav";
import { getAllData } from "./config/firebase/firebasemethods";

const App = () => {
  // States
  const [data, setData] = useState([]);
  // States

  //  useEffect
  useEffect(() => {
    const renderAllData = async () => {
      const blogs = await getAllData("blog's");
      console.log(blogs);
      data.push(blogs);
      setData(...data);
    };
    renderAllData();
  }, []);
  //  useEffect

  return (
    <>
      {/* navbar */}
      <Nav />
      {/* navbar */}

      {/* Main Div */}
      <div className="w-full">
        {/* Heading */}
        <div className="mt-5">
          <h1 className="text-center text-3xl text-[#00D9C0] font-semibold ">
            Blog's
          </h1>
        </div>
        {/* Heading */}

        {/* Blogs */}

        <div className="flex flex-col gap-6 h-full p-11 ">
          {data ? (
            data.map((item) => {
              return (
                <div
                  key={item.documentId}
                  className=" p-5 rounded-2xl bg-[#00D9C0] w-full shadow-2xl  text-black"
                >
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
                </div>
              );
            })
          ) : (
            <h1 className="text-white text-center text-4xl my-5">loading...</h1>
          )}
        </div>
        {/* Blogs */}
      </div>
      {/* Main Div */}
    </>
  );
};

export default App;
