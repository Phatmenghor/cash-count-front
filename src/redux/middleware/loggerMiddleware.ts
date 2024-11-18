import { Middleware } from "@reduxjs/toolkit";

const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (process.env.NEXT_PUBLIC_NODE_ENV !== "production") {
    console.log("@@!!! Next state:", store.getState());
    console.log("@@!!! Dispatching action:", action);
  }
  const result = next(action);

  return result;
};

export default loggerMiddleware;
