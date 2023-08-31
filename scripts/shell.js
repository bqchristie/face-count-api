import repl from "repl";

import config from "../src/utils/config.js";
import app from "../src/app.js";
import { User, Request, Image } from "../src/models/init.js";
import UserService from "../src/services/user.js";
import RequestService from "../src/services/request.js";
import ImageService from "../src/services/image.js";

const main = async () => {
  process.stdout.write("Database and Express app initialized.\n");
  process.stdout.write("Autoimported modules: config, app, models, services\n");

  const r = repl.start("> ");
  r.context.config = config;
  r.context.app = app;
  r.context.models = {
    User,
    Request,
    Image,
  };
  r.context.services = {
    UserService,
    RequestService,
    ImageService,
  };

  r.on("exit", () => {
    process.exit();
  });

  r.setupHistory(".shell_history", () => {});
};

main();
