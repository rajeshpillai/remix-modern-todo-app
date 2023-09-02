import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import NavBar from "./components/ui/navbar";

import styles from "../styles/app.css";

// export const links: LinksFunction = () => [
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }, {rel: "stylesheet", href: styles}] : []),
// ];

export const links: LinksFunction = () => [
  {rel: "stylesheet", href: styles},
  {rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"}
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      
      <body className="flex flex-col items-center">
        <div className="container mx-auto py-8 text-center prose">
          <h1 className="text-4xl font-bold text-blue-600">Todo App</h1>
          <h6 className="text-xl text-red-300 mt-2">The best remix demo app in the world!</h6>
          <div className="divider h-px bg-gray-300 my-4"></div>

          <NavBar />

          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        {/* <LiveReload /> */}
      </body>
    </html>
  );
}
