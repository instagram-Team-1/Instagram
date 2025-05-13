import { PreUser } from "../../models/preUser";
import { Request, Response } from "express";

const changePre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    

    const deletedPreUser = await PreUser.findOneAndDelete({ _id: id });

    if (!deletedPreUser) {
      res.status(404).json({ message: "PreUser not found" });
      return;
    }

    res.status(200).json({ message: "PreUser deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default changePre;
