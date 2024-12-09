import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdating: false,
  userdata: {
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    pan: "",
    gender: "",
    dob: "",
    address: "",
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/checkAuth");
      set({ authUser: res.data.decoded });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/register", data);
      set({ authUser: null });
      toast.success("Account created successfully");
      window.location.href = '/signin'
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/login", data);
      set({ authUser: res.data });
      
      // Set in cookie
      var expires = new Date(Date.now() + 7200 * 1000);
      document.cookie = "token="+res.data.token+"; max-age=" + expires.getTime() + "; path=/;";

      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      // await axiosInstance.post("/logout");
      set({ authUser: null });

      // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = 'token=; Max-Age=0; path=/';

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updatedata: async (data) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.patch("/updatedata", data);
      toast.success("Updated successfully");
      set({ isUpdating: false });
    } catch (error) {
      toast.error(error.response.data.message);
      set({ isUpdating: false });
    } finally {
      set({ isUpdating: false });
    }
  },

  getdata: async (data) => {
    try {
      const res = await axiosInstance.get("/getdata");
      const data = res.data.user;
      set({ userdata: {
        name: data.name,
        email: data.email,
        phone: data.user_datum?.phone,
        aadhar: data.user_datum?.aadhar,
        pan: data.user_datum?.pan,
        gender: data.user_datum?.gender,
        dob: data.user_datum?.dob,
        address: data.user_datum?.address,
      } });
    } catch (error) {
      toast.error(error.response.data.message);
    } 
  },

}));

export default useAuthStore;
