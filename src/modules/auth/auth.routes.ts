import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controllers";
import upload from "../../middlewares/multer";

const router = Router()

router.post(
    "/create-user",
    //  auth middleware
    upload.single("photo"),
    (req: Request, res: Response, next: NextFunction) => {
        const body = JSON.parse(req.body.data);
        req.body = body;
        next();

    },
    AuthControllers.createUser
)



router.post("/login", AuthControllers.loginUser)
router.get("/refresh-token", AuthControllers.refreshToken)
// router.get("/", AuthControllers.getAllUser)
// router.get("/:userId", AuthControllers.getSingleUser)
// router.put("/:userId", AuthControllers.updateUser)
// router.delete("/:userId", AuthControllers.deleteUser)

export const AuthRoutes = router