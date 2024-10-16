import { checkAuth, login, logOut, signUp } from "../../controllers/admin/auth";

const express = require("express");
const router = express.Router();

router.route("/checkAuth").get(checkAuth);

router.route("/login").post(login);

router.route("/signup").post(signUp);

router.route("/logout").post(logOut);

module.exports = router;
