import React, { useEffect, useState } from "react";
import useAuthStore from "../Auth/useAuthStore";
import { Loader2 } from "lucide-react";

const Home = () => {
  const { updatedata, isUpdating, getdata, userdata } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    updatedata(formData);
  };

  useEffect(() => {
    getdata();
  }, [getdata]);

  const [formData, setFormData] = useState({
    name: userdata?.name,
    email: userdata?.email,
    phone: userdata?.phone,
    aadhar: userdata?.aadhar,
    pan: userdata?.pan,
    gender: userdata?.gender,
    dob: userdata?.dob,
    address: userdata?.address,
  });

  useEffect(() => {
    if (userdata) {
      const { name, phone, aadhar, pan, gender, dob, address, email } =
        userdata;
      setFormData({
        name: name || "",
        email: email || "",
        phone: phone || "",
        aadhar: aadhar || "",
        pan: pan || "",
        gender: gender || "",
        dob: dob || "",
        address: address || "",
      });
    }
  }, [userdata]);

  return (
    <>
      <div className="flex justify-center items-center w-full  min-h-screen bg-white px-5 py-10">
        <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-black/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
          <div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0">
            <h1 className="text-center text-2xl sm:text-3xl font-semibold text-[#4A07DA]">
              Personal Identifiable Information
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="w-full mt-5 sm:mt-8">
                <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    readOnly
                    placeholder="Enter Your Email"
                    className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Enter Your Phone No"
                    className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
                    maxLength={10}
                    minLength={10}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Enter Your Adhaar"
                    className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
                    maxLength={12}
                    minLength={12}
                    value={formData.aadhar}
                    onChange={(e) =>
                      setFormData({ ...formData, aadhar: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Enter Your Pancard"
                    className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
                    value={formData.pan}
                    maxLength={10}
                    minLength={10}
                    onChange={(e) =>
                      setFormData({ ...formData, pan: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    placeholder="Enter Your DOB"
                    className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="Enter Your Address"
                    className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
                    rows={10}
                    cols={5}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>

                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
                  >
                    <option value="">Select Your Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>

                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
