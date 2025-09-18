import express from "express";
import { validateBody } from "../middleware/bodyvalidate.middleware";
import { signUp } from "../controllers/user.controller";
import { signUpValidation } from "../utils/validates/user.validate";

enum RouteSource {
    Body,
    Query,
    Params
}

const router = express.Router();

router.post('/signUp', validateBody(signUpValidation), signUp)

export default router;