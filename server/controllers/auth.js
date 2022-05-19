const Merchant = require("../models/merchant");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.createMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ email: req.body.email });
    if (merchant) {
      return res.status(400).json({
        message: "Merchant already exists",
        status: "error",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newMerchant = new Merchant(req.body);
    await newMerchant.save();
    const token = jsonwebtoken.sign(
      { id: newMerchant._id, type: "merchant" },
      process.env.JWT_SECRET,
      {
        //expires in 15 minutes
        expiresIn: "15m",
      }
    );
    //sending email to merchant for verification
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Verify your email",
      // text: `Please verify your email by clicking on the following link:

      // http://${process.env.HOST}/merchant/verify/${newMerchant._id}?token=${token}`,
      html: `<p>Please verify your email by clicking on the following link:
       <a href="http://${process.env.HOST}/merchant/verify/${newMerchant._id}/${token}">
       http://${process.env.HOST}/merchant/verify/${newMerchant._id}/${token}</a></p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).json({
      message: "Email sent to your account. Please verify your email",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        status: "error",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    const token = jsonwebtoken.sign(
      { id: newUser._id, type: "user" },
      process.env.JWT_SECRET,
      {
        //expires in 15 minutes
        expiresIn: "15m",
      }
    );
    //sending email to merchant for verification
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Verify your email",
      // text: `Please verify your email by clicking on the following link:

      // http://${process.env.HOST}/merchant/verify/${newMerchant._id}?token=${token}`,
      html: `<p>Please verify your email by clicking on the following link:
       <a href="http://${process.env.HOST}/user/verify/${newUser._id}/${token}">
       http://${process.env.HOST}/user/verify/${newUser._id}/${token}</a></p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(201).json({
      message: "Email sent to your account. Please verify your email",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    if (req.body.type === "user") {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          message: "User does not exist",
          status: "error",
        });
      }
      if (user.isVerified === false) {
        return res.status(400).json({
          message: "Please verify your email",
          status: "error",
        });
      }
      if (user.provider === "google.com") {
        return res.status(400).json({
          message: "Please login with google",
          status: "error",
        });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
          status: "error",
        });
      }
      const token = jsonwebtoken.sign(
        { id: user._id, type: "user" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      res.status(200).json({
        message: "User logged in successfully",
        status: "success",
        token,
      });
    } else {
      const merchant = await Merchant.findOne({
        email: req.body.email,
      }).populate("social");
      // .select("-password");
      if (!merchant) {
        return res.status(400).json({
          message: "Merchant does not exist",
          status: "error",
        });
      }
      if (merchant.isVerified === false) {
        return res.status(400).json({
          message: "Please verify your email",
          status: "error",
        });
      }
      if (merchant.provider === "google.com") {
        return res.status(400).json({
          message: "Please login with google",
          status: "error",
        });
      }
      const isMatch = await bcrypt.compare(
        req.body.password,
        merchant.password
      );
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
          status: "error",
        });
      }
      const token = jsonwebtoken.sign(
        { id: merchant._id, type: "merchant" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      res.status(200).json({
        message: "Merchant logged in successfully",
        status: "success",
        token,
        type: merchant.type,
        merchant: {
          name: merchant.name,
          email: merchant.email,
          phone: merchant.phone,
          isVerified: merchant.isVerified,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.loginWithGoogle = async (req, res) => {
  try {
    if (req.body.type === "user") {
      const user = await User.findOne({ email: req.body.email });
      //check if user exists and the provider does not exist in the database

      if (!user) {
        //create new user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(
            Math.random().toString(36).substring(2, 15),
            10
          ),
          isVerified: true,
          type: "user",
          provider: req.body.provider,
        });
        await newUser.save();
      }
      if (user.provider !== "google.com") {
        return res.status(400).json({
          message: "You are not signed up with google",
          status: "error",
        });
      }
      //we dont have password for google users, so we cant compare passwords
      const token = jsonwebtoken.sign(
        { id: user._id, type: "user" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      res.status(200).json({
        message: "User logged in successfully",
        status: "success",
        token,
      });
    } else {
      const merchant = await Merchant.findOne({ email: req.body.email });
      if (merchant.provider !== "google.com") {
        return res.status(400).json({
          message: "You are not signed up with google",
          status: "error",
        });
      }

      if (!merchant) {
        const newMerchant = new Merchant({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(
            Math.random().toString(36).substring(2, 15),
            10
          ),
          isVerified: true,
          type: "merchant",
          provider: req.body.provider,
        });
        await newMerchant.save();
      }
      //we dont have password for google users, so we cant compare passwords
      const token = jsonwebtoken.sign(
        { id: merchant._id, type: "merchant" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      res.status(200).json({
        message: "Merchant logged in successfully",
        status: "success",
        token,
        type: "merchant",
        merchant: {
          name: merchant.name,
          email: merchant.email,
          services: merchant.services,
          isVerified: merchant.isVerified,
          orders: merchant.orders,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Logged out successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.verify = async (req, res) => {
  try {
    if (req.route.path === "/merchant/verify/:id/:token") {
      const merchant = await Merchant.findById(req.params.id);
      if (!merchant) {
        return res.status(400).json({
          message: "Merchant does not exist",
          status: "error",
        });
      }
      if (merchant.isVerified === true) {
        return res.status(400).json({
          message: "Merchant already verified",
          status: "error",
        });
      }
      const verifyToken = jsonwebtoken.verify(
        req.params.token,
        process.env.JWT_SECRET
      );

      //check if token is expired
      const currentTime = new Date().getTime();
      if (currentTime > verifyToken.exp * 1000) {
        return res.status(400).json({
          message: "Token expired",
          status: "error",
        });
      }
      merchant.isVerified = true;
      await merchant.save();
      res.status(200).json({
        message: "Email verified successfully",
        status: "success",
      });
    } else {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({
          message: "User does not exist",
          status: "error",
        });
      }
      if (user.isVerified === true) {
        return res.status(400).json({
          message: "User already verified",
          status: "error",
        });
      }
      const verifyToken = jsonwebtoken.verify(
        req.params.token,
        process.env.JWT_SECRET
      );

      //check if token is expired
      const currentTime = new Date().getTime();
      if (currentTime > verifyToken.exp * 1000) {
        return res.status(400).json({
          message: "Token expired",
          status: "error",
        });
      }
      user.isVerified = true;
      await user.save();
      res.status(200).json({
        message: "Email verified successfully",
        status: "success",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      status: "error",
    });
  }
};

exports.sendVerificationEmail = async (req, res) => {
  try {
    if (req.body.type === "merchant") {
      const merchant = await Merchant.findOne({ email: req.body.email });
      if (!merchant) {
        return res.status(400).json({
          message: "Merchant does not exist",
          status: "error",
        });
      }
      if (merchant.isVerified === true) {
        return res.status(400).json({
          message: "Merchant already verified",
          status: "error",
        });
      }
      const token = jsonwebtoken.sign(
        { id: merchant._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: merchant.email,
        subject: "Verify your email",
        // text: `Please verify your email by clicking on the following link:

        // http://${process.env.HOST}/merchant/verify/${newMerchant._id}?token=${token}`,
        html: `<p>Please verify your email by clicking on the following link:
       <a href="${process.env.HOST}/merchant/verify/${merchant._id}/${token}">
       http://${process.env.HOST}/merchant/verify/${merchant._id}/${token}</a></p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res.status(200).json({
        message: "Email sent to merchant. Please verify your email",
        status: "success",
      });
    } else {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          message: "User does not exist",
          status: "error",
        });
      }

      if (user.isVerified === true) {
        return res.status(400).json({
          message: "User already verified",
          status: "error",
        });
      }
      const token = jsonwebtoken.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Verify your email",
        // text: `Please verify your email by clicking on the following link:

        // http://${process.env.HOST}/user/verify/${newuser._id}?token=${token}`,
        html: `<p>Please verify your email by clicking on the following link:
       <a href="http://${process.env.HOST}/user/verify/${user._id}/${token}">
       http://${process.env.HOST}/user/verify/${user._id}/${token}</a></p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res.status(200).json({
        message: "Email sent to user. Please verify your email",
        status: "success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    if (req.body.type === "merchant") {
      const merchant = await Merchant.findOne({ email: req.body.email });
      if (!merchant) {
        return res.status(400).json({
          message: "Merchant does not exist",
          status: "error",
        });
      }
      const token = jsonwebtoken.sign(
        { id: merchant._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: merchant.email,
        subject: "Reset your password",
        // text: `Please verify your email by clicking on the following link:

        // http://${process.env.HOST}/merchant/verify/${newMerchant._id}?token=${token}`,
        html: `<p>Reset your password by clicking on the following link:
       <a href="http://${process.env.HOST}/merchant/reset/${merchant._id}/${token}">
       http://${process.env.HOST}/merchant/reset/${merchant._id}/${token}</a></p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res.status(200).json({
        message: "Email sent to merchant. Please reset your password",
        status: "success",
      });
    } else {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          message: "User does not exist",
          status: "error",
        });
      }
      const token = jsonwebtoken.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Reset your password",
        // text: `Please verify your email by clicking on the following link:

        // http://${process.env.HOST}/user/verify/${newuser._id}?token=${token}`,
        html: `<p>Reset your password by clicking on the following link:
        <a href="http://${process.env.HOST}/user/reset/${user._id}/${token}">
        http://${process.env.HOST}/user/reset/${user._id}/${token}</a></p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res.status(200).json({
        message: "Email sent to user. Please reset your password",
        status: "success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    if (req.body.type === "merchant") {
      const merchant = await Merchant.findById(req.params.id);
      if (!merchant) {
        return res.status(400).json({
          message: "Merchant does not exist",
          status: "error",
        });
      }
      //after verifying the token, we can change the password, and we dont compare the old password
      const verifyToken = jsonwebtoken.verify(
        req.params.token,
        process.env.JWT_SECRET
      );
      if (!verifyToken) {
        return res.status(400).json({
          message: "Invalid token",
          status: "error",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      merchant.password = hashedPassword;
      await merchant.save();
      return res.status(200).json({
        message: "Password changed successfully",
        status: "success",
      });
    } else {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({
          message: "User does not exist",
          status: "error",
        });
      }
      const verifyToken = jsonwebtoken.verify(
        req.params.token,
        process.env.JWT_SECRET
      );
      if (!verifyToken) {
        return res.status(400).json({
          message: "Invalid token",
          status: "error",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({
        message: "Password changed successfully",
        status: "success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};
