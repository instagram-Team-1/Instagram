import { Request, Response } from "express";

import { User } from "../../models/userModel";
import mongoose from "mongoose";

export const getSuggestedFollowers = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.params.id;

    if (!currentUserId) {
       res.status(400).json({ message: "User ID required" });
       return;
    }

    const currentUser = await User.findById(currentUserId).select("following");
    if (!currentUser) {
       res.status(404).json({ message: "User not found" });
       return;
    }

    const followingIds = currentUser.following.map((id) => id.toString());

    const friends = await User.find({ _id: { $in: followingIds } }).select(
      "following"
    );

    const friendsOfFriendsSet = new Set<string>();
    for (const friend of friends) {
      friend.following?.forEach((id) => {
        const stringId = id.toString();
        if (stringId !== currentUserId && !followingIds.includes(stringId)) {
          friendsOfFriendsSet.add(stringId);
        }
      });
    }

    let suggestionIds = Array.from(friendsOfFriendsSet);
    let suggestedUsers;

    if (suggestionIds.length > 0) {
      suggestedUsers = await User.find({ _id: { $in: suggestionIds } })
        .select("_id username fullname avatarImage")
        .limit(10);
    }

    // Хэрвээ санал болгох хэрэглэгч олдоогүй бол random-аар санал болгох
    if (!suggestedUsers || suggestedUsers.length === 0) {
      suggestedUsers = await User.aggregate([
        {
          $match: {
            _id: {
              $nin: [
                ...followingIds.map((id) => new mongoose.Types.ObjectId(id)),
                new mongoose.Types.ObjectId(currentUserId),
              ],
            },
          },
        },
        { $sample: { size: 20 } }, // Random-аар 10 хэрэглэгч
        {
          $project: {
            _id: 1,
            username: 1,
            fullname: 1,
            avatarImage: 1,
          },
        },
      ]);
    }

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Suggested followers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};