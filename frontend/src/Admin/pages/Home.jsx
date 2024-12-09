import React, { useEffect, useState } from "react";
import useAdminAuthStore from "../Auth/useAdminAuthStore";

const Home = () => {
  const { getalldata, userdata } = useAdminAuthStore();

  useEffect(() => {
    getalldata();
  }, [getalldata]);
  return (
    <>
      <div className=" w-full  min-h-screen bg-white px-5 py-10">
        <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-black/20 w-full rounded-md items-stretch px-5 xl:px-5 py-5">
          <div className="mx-auto w-full md:p-10 py-5 md:py-0">
            <h3 className="text-left font-semibold text-[#4A07DA]">
              All User Data
            </h3>

            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>DOB</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Gender</th>
                    <th>Aadhar No</th>
                    <th>Pan No</th>
                  </tr>
                </thead>
                <tbody>
                  {userdata.length != 0 &&
                    userdata.map((user, index) => {
                      return (
                        <tr key={user.id}>
                          <th>{index +1}</th>
                          <td>{user?.name}</td>
                          <td>{user.email}</td>
                          <td>{user.user_datum?.dob}</td>
                          <td>{user.user_datum?.phone}</td>
                          <td>{user.user_datum?.address}</td>
                          <td>{user.user_datum?.gender}</td>
                          <td>{user.user_datum?.aadhar}</td>
                          <td>{user.user_datum?.pan}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
