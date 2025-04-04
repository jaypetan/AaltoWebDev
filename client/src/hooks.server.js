import { decodeJwt } from "jose";

const COOKIE_KEY = "token";

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get(COOKIE_KEY);
  if (token) {
    try {
      const payload = decodeJwt(token);
      event.locals.user = { email: payload.email };
    } catch (e) {
      console.log(e);
    }
  }

  return await resolve(event);
};