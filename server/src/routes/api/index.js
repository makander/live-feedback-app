import { Router } from "express";
import usersRoutes from "./users";
import mySessionRoutes from "./mysession";

const routes = new Router();

routes.use("/user", usersRoutes);
routes.use("/my-session", mySessionRoutes);
export default routes;
