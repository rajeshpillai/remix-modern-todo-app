import fastify from "fastify";
import * as serverBuild from "./build/index.mjs";
import { remixFastifyPlugin } from "@mcansh/remix-fastify";

let MODE = process.env.NODE_ENV;

async function start() {
  let app = fastify();

  await app.register(remixFastifyPlugin, {
    assetsBuildDirectory: serverBuild.assetsBuildDirectory,
    build: serverBuild,
    mode: MODE,
    publicPath: serverBuild.publicPath,
  });

  // app.addHook('preHandler', (request, reply, done) => {
  //   const allowedPaths = ["/?index"];
  //   console.log("preHandler: ", request.url);
  //   // if (allowedPaths.includes(request.url)) {
  //     console.log("***** ALLOWED *****");
  //     reply.header("Access-Control-Allow-Origin", "*");
  //     reply.header("Access-Control-Allow-Methods", "POST");
  //     reply.header("Access-Control-Allow-Headers", "*");
  //   // }
  
  //   // if request is preflight request
  //   if (request.method === "OPTIONS") return reply.send();
  
  //   done();
  // })
  

  let port = process.env.PORT ? Number(process.env.PORT) : 3000;

  app
    .listen({ port, host: "0.0.0.0" })
    .then((address) => {
      console.log(`Fastify server listening at ${address}`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});