import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation, useFetcher, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { Todo } from "@prisma/client";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { getUserId, requireUserId,} from "~/utils/session.server";


export const meta: V2_MetaFunction = () => {
  return [
    { title: "Todo App" },
    { name: "description", content: "Welcome to The Todo App!" },
  ];
};

export default function Index() {

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        width: 600,
        margin: "auto",
      }}
    >
      <h2>Todo App</h2>
      <h4>The best remix demo app in the world!</h4>
      <Link to="/todos">Todo List</Link>
    </div>
  );
}