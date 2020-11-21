module.exports.cookieOptions = {
  httpOnly: true, // Can't be read by Javascript in the browser
  secure: process.env.NODE_ENV === "production", //for HTTPS only
  path: "/",
  domain: process.env.COOKIE_DOMAIN,
  sameSite:
    "none" /* would allow third party cookies because 
  the frontend has a different domain compared to the backend. In a real world
  website, your frontend and backend should have the same domain  */,
};
