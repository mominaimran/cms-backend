const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`); // log in server console

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    // stack sirf development mode me bhejna (security best practice)
    stack: process.env.NODE_ENV === "production" ? "🥷 hidden" : err.stack,
  });
};

export default errorHandler;
