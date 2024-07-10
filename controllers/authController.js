const User = require("../models/User");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide name, email and password"
    );
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new CustomError.BadRequestError(
      "Email already exists. Please use another email."
    );
  }
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  // ensure that role cannot be set by user by passing in the exact fields you want to create
  const user = await User.create({ email, name, password, role });

  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  // removed - refactored to utils
  // const token = user.createJWT();
  // const token = createJWT(tokenUser);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
  });
};

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  }); //setting the cookie with same name to a blank value to overwrite the login cookie
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = {
  register,
  login,
  logout,
};
