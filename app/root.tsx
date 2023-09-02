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

import styles from "../styles/app.css";

// export const links: LinksFunction = () => [
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }, {rel: "stylesheet", href: styles}] : []),
// ];

export const links: LinksFunction = () => [
  {rel: "stylesheet", href: styles},
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
        <div className="prose">
          <h1>Todo App</h1>
          <h4>The best remix demo app in the world!</h4>
          <div className="divider"></div>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {/* <LiveReload /> */}
      </body>
    </html>
  );
}
