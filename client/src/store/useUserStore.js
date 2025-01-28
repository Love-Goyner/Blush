import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    loading : false,

    updateProfile : async (data) => {
        try {
            set({loading: true})
            const res = await axiosInstance.put("/users/update", data);
            useAuthStore.getState().setAuthUser(res.data.user);
			toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        }finally{
            set({loading: false})
        }
    },
}))