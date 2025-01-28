import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set) => ({
  loading: true,
  messages: [],

  sendMessage: async (receiverId, content) => {
    try {
      //show message imediaatly
      set((state) => ({
        messages: [
          ...state.messages,
          {
            _id:Date.now(),
            sender: useAuthStore.getState().authUser._id,
            content,
          },
        ],
      }));

      
      const res = await axiosInstance.post("/messages/send", {
        receiverId,
        content,
      });
      console.log("message sent", res.data.message.content);
    } catch (error) {
      toast.error(error.response.data.message || "something went wrong");
    }
  },

  getMessages: async (userId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/messages/conversation/" + userId);
      set({ messages: res.data.messages });
      
    } catch (error) {
      console.log(error);
      set({ messages: [] });
    } finally {
      set({ loading: false });
    }
  },

  subscribeToMessages: () => {
    const socket = getSocket();
    socket.on("newMessage", ({ message }) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });
  },

  unsubscribeToMessages: () => {
    const socket = getSocket();
    socket.off("newMessage");
  },
}));
