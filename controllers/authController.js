const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");
const Email = require("./../utils/email");

const signToke = id => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToke(user._id);

  const cookieOptions = {
    httpOnly: true
  };
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const url = `${req.protocol}://${req.get("host")}/me`;

  const email = new Email(newUser, url);
  await email.sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError("Invalid email or password.", 401));
  }
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 900000),
    httpOnly: true
  });
  res.status(200).json({ status: "success" });
};

exports.isLoggedIn = async (req, res, next) => {
  // check if token is present in header or not
  if (req.cookies.jwt) {
    try {
      // verify the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET_KEY
      );

      // verify if the user still exists or not
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // grant access to the protected route.
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;
  // check if token is present in header or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("Pleas log in to continue."), 401);
  }

  // verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

  // verify if the user still exists or not
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exist."),
      401
    );
  }

  // grant access to the protected route.
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action."),
        403
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("The account with the given email not found."),
      404
    );
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken} `;
    await new Email(user, resetURL).sendPasswordResetLink();

    res.status(200).json({
      status: "success",
      message: "Token sent to email."
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpireTime = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(error);
    next(
      new AppError("The email was not able to send. Please try later."),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpireTime: {
      $gt: Date.now()
    }
  });
  if (!user) {
    return next(new AppError("The token is invalid or expired", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpireTime = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.isPasswordCorrect(req.body.oldPassword, user.password))) {
    return next(new AppError("The password is not correct.", 401));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
