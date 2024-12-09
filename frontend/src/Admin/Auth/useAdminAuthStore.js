import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

const useAdminAuthStore = create((set, get) => ({
  authAdminUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  userdata: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/checkAdminAuth");
      set({ authAdminUser: res.data.decoded });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authAdminUser: null });
      document.cookie = "admintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/adminlogin", data);
      set({ authAdminUser: res.data });

      // Set in cookie
      var expires = new Date(Date.now() + 7200 * 1000);
      document.cookie = "admintoken="+res.data.token+"; max-age=" + expires.getTime() + "; path=/;";

      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      // await axiosInstance.post("/adminlogout");
      set({ authAdminUser: null });

      // document.cookie = "admintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = 'admintoken=; Max-Age=0; path=/';

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },


  getalldata: async (data) => {
    try {
      const res = await axiosInstance.get("/getalldata");
      const data = res.data.user;
      set({ userdata: data });
    } catch (error) {
      toast.error(error.response.data.message);
    } 
  },

}));

export default useAdminAuthStore;
