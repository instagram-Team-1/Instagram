    import { Request, Response } from "express";
    import roomModel from "../../models/roomModel";

    const checker = async (req: Request, res: Response) => {
    try {
        const { selectedUsers } = req.body;
        if (!Array.isArray(selectedUsers) || selectedUsers.length === 0) {
        res.status(400).json({ message: "Invalid selectedUsers array" });
        return
        }
        console.log("Selected Users:", selectedUsers);
        const validUsers = selectedUsers.filter(user => user && user.name && user.id);
        if (validUsers.length < 2) {
        res.status(400).json({ message: "At least two valid users are required" });
        return
        }
        const userNames = validUsers.map((user) => user.name);
        console.log("User Names:", userNames);
        const existingRoom = await roomModel.findOne({
        participants: { $all: validUsers.map((user) => user.id) },
        });
        if (existingRoom) {
        res.status(200).json({ roomExists: true, roomId: existingRoom._id });
        return
        }
        const newRoom = await roomModel.create({
        participants: validUsers.map((user) => user.id),
        name: userNames.join(", "),
        });
        res.status(201).json({
        message: "Room created successfully",
        roomId: newRoom._id,
        });
    } catch (error) {
        console.error("Error in createRoom:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export default checker;