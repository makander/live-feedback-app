import { Router } from "express";
import usersRoutes from "./users";

const routes = new Router();

routes.use("/user", usersRoutes);

export default routes;