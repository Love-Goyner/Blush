import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";

export const useMatchStore = create((set, get) => ({
  isLoadingMyMatches: false,
  isLoadingUserProfiles: false,
  matches: [],
  userProfiles: [],
  swipeFeedback: null,

  getMyMatches: async () => {
    try {
      set({ isLoadingMyMatches: true });
      const res = await axiosInstance.get("/matches");
      set({ matches: res.data.matches });
    } catch (error) {
      set({ matches: [] });
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },

  getUserProfiles: async () => {
    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: res.data.users });
    } catch (error) {
      set({ matches: [] });
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },

  swipeLeft: async (user) => {
    try {
      set({ swipeFeedback: "passed" });
      await axiosInstance.post(`/matches/swipe-left/${user._id}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to swipe left");
    } finally {
      setTimeout(() => {
        set({ swipeFeedback: null });
      }, 1500);
    }
  },

  swipeRight: async (user) => {
    console.log(user);
    
    try {
      set({ swipeFeedback: "liked" });
			await axiosInstance.post("/matches/swipe-right/" + user._id);
    } catch (error) {
      console.log("error in swipe right",error);
      toast.error("Failed to swipe right");
    } finally {
      setTimeout(() => {
        set({ swipeFeedback: null });
      }, 1500);
    }
  },

  subscribeToNewMatch : () => {
    try {
      const socket = getSocket();

      socket.on("newMatch", (newMatch) => {
        set(state => ({
          matches: [...state.matches, newMatch]
        }))
        toast.success("You got a new Match")
      })
    } catch (error) {
      console.log(error);
    }
  },

  unsubscribeToNewMatch : () => {
    try {
      const socket = getSocket();
      socket.off("newMatch")
    } catch (error) {
      console.log(error);
    }
  }
}));
