import Message from "../models/messageModels.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    //send mssg in real time with socket io
    const io = getIO();
    const connectedUser = getConnectedUsers();
    const receiverSocketId = connectedUser.get(receiverId);

    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", {
        message : newMessage
      })
    }

    return res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { receiver: userId, sender: req.user._id },
      ],
    }).sort("createdAt");

    return res.status(200).json({
        success: true,
        messages,
    });

  } catch (error) {
    console.log("Error in getConversation: ", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
  }
};
