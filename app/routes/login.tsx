import type {
  ActionArgs,
  LinksFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
} from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import {
  createUserSession,
  login,
  register,
} from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: V2_MetaFunction = () => {
  const description =
    "Login to maintain your own Todo List!";

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "Remix Todo App | Login" },
  ];
};

function validateEmail(email: string) {
  if (email.length < 5) {
    return "Email must be at least 5 characters long";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

function validateUrl(url: string) {
  let urls = ["/todos", "/", "https://remix.run"];
  if (urls.includes(url)) {
    return url;
  }
  return "/";
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const password = form.get("password");
  const email = form.get("email");
  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/todos"
  );
  if (
    typeof loginType !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { loginType, password, email };
  const fieldErrors = {
    password: validatePassword(password),
    email: validateEmail(email),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ email, password });
      console.log("Login: ", user );
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "Email/Password combination is incorrect",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { email },
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with Email ${email} already exists`,
        });
      }
      const user = await register({ email, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError:
            "Something went wrong trying to create a new user.",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: "Login type invalid",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={
              searchParams.get("redirectTo") ?? undefined
            }
          />
          <fieldset>
            <legend className="sr-only">
              Login or Register?
            </legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={
                  actionData?.fields?.loginType ===
                  "register"
                }
              />{" "}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="email-input">Email</label>
            <input
              type="text"
              id="email-input"
              name="email"
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.email
              )}
              aria-errormessage={
                actionData?.fieldErrors?.email
                  ? "email-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.email ? (
              <p
                className="form-validation-error"
                role="alert"
                id="email-error"
              >
                {actionData.fieldErrors.email}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(
                actionData?.fieldErrors?.password
              )}
              aria-errormessage={
                actionData?.fieldErrors?.password
                  ? "password-error"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p
                className="form-validation-error"
                role="alert"
              >
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </Form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}