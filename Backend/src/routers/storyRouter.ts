import { Router, Response, NextFunction, Request } from "express";
import { StoryController } from "../controller/Story/storyController";
import { Authenticate } from "../middleware/Authenticate.middleware";
import { MyRequest } from "../interfaces/Request.interface";

const router = Router();
const Controller = new StoryController();

router.post(
  "/upload",
  Authenticate,
  (request: Request, response: Response, next: NextFunction) => {
    Controller.upload(request as MyRequest, response);
  }
);

export default router;
