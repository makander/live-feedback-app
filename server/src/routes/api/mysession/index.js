import { Router } from "express";

import * as MySessionController from "./session-controller";

const routes = new Router();

// @route GET api/my-session
// @desc Load Session Data from MongoDB
// @access Private
routes.get("/", MySessionController.getSessions);
routes.get("/:id", MySessionController.getSession);

export default routes;
