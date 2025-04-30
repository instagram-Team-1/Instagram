import { Request, Response } from "express";
import { User } from "../../models/userModel";


export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;


    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData }, 
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error: any) {
    console.error("Error updating user:", error);
    // Уник талбарын алдаа (email, username гэх мэт)
    if (error.code === 11000) {
      res.status(400).json({ message: "Duplicate field value entered" });
      return;
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
