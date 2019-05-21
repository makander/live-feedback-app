import { Router } from "express";
import mySessionRoutes from "./mysession";

const routes = new Router();

routes.get("/my-sessions", mySessionRoutes);

export default routes;
