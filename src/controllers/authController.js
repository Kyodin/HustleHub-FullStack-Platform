const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const logger = require("../utils/logger");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;


// Register user
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const role =
            req.body.role === "freelancer"
                ? "freelancer"
                : "client";

        // Check whether account already exists
        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "A user with this email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            failedLoginAttempts: 0,
            lockUntil: null
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        logger.error("Registration error", {
            event: "REGISTRATION_ERROR",
            message: error.message,
            ip: req.ip
        });

        return res.status(500).json({
            success: false,
            message:
                "An error occurred while registering the user."
        });
    }
};


// Login user
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });

        // User does not exist
        if (!user) {
            logger.warn("Failed login attempt", {
                event: "LOGIN_FAILED",
                email,
                reason: "User not found",
                ip: req.ip
            });

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const now = new Date();

        // Account currently locked
        if (
            user.lockUntil &&
            user.lockUntil > now
        ) {
            const remainingMilliseconds =
                user.lockUntil.getTime() -
                now.getTime();

            const remainingMinutes =
                Math.ceil(
                    remainingMilliseconds / 60000
                );

            logger.warn(
                "Login attempted on locked account",
                {
                    event:
                        "LOCKED_ACCOUNT_LOGIN_ATTEMPT",
                    userId:
                        user._id.toString(),
                    email:
                        user.email,
                    ip:
                        req.ip,
                    lockUntil:
                        user.lockUntil
                }
            );

            return res.status(423).json({
                success: false,
                message:
                    `Account temporarily locked. Try again in ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}.`
            });
        }

        // Clear expired account lock
        if (
            user.lockUntil &&
            user.lockUntil <= now
        ) {
            user.failedLoginAttempts = 0;
            user.lockUntil = null;

            await user.save();

            logger.info(
                "Expired account lock cleared",
                {
                    event:
                        "ACCOUNT_LOCK_EXPIRED",
                    userId:
                        user._id.toString(),
                    email:
                        user.email
                }
            );
        }

        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        // Incorrect password
        if (!passwordMatch) {
            user.failedLoginAttempts += 1;

            // Lock after 5 failed attempts
            if (
                user.failedLoginAttempts >=
                MAX_FAILED_ATTEMPTS
            ) {
                user.lockUntil =
                    new Date(
                        Date.now() +
                        LOCK_TIME_MS
                    );

                await user.save();

                logger.warn(
                    "Account locked after repeated failed logins",
                    {
                        event:
                            "ACCOUNT_LOCKED",
                        userId:
                            user._id.toString(),
                        email:
                            user.email,
                        failedLoginAttempts:
                            user.failedLoginAttempts,
                        lockUntil:
                            user.lockUntil,
                        ip:
                            req.ip
                    }
                );

                return res.status(423).json({
                    success: false,
                    message:
                        "Account temporarily locked due to repeated failed login attempts. Try again in 15 minutes."
                });
            }

            await user.save();

            const attemptsRemaining =
                MAX_FAILED_ATTEMPTS -
                user.failedLoginAttempts;

            logger.warn(
                "Failed login attempt",
                {
                    event:
                        "LOGIN_FAILED",
                    userId:
                        user._id.toString(),
                    email:
                        user.email,
                    failedLoginAttempts:
                        user.failedLoginAttempts,
                    attemptsRemaining,
                    ip:
                        req.ip
                }
            );

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password.",
                attemptsRemaining
            });
        }

        // Successful login resets failed attempts
        if (
            user.failedLoginAttempts > 0 ||
            user.lockUntil
        ) {
            user.failedLoginAttempts = 0;
            user.lockUntil = null;

            await user.save();
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        logger.info("Successful login", {
            event: "LOGIN_SUCCESS",
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            ip: req.ip
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        logger.error("Login error", {
            event: "LOGIN_ERROR",
            message: error.message,
            ip: req.ip
        });

        return res.status(500).json({
            success: false,
            message:
                "An error occurred while logging in."
        });
    }
};


// Get profile
const getProfile = async (req, res) => {
    try {
        const user =
            await User.findById(
                req.user.userId
            )
                .select(
                    "-password -failedLoginAttempts -lockUntil"
                );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        logger.error("Profile error", {
            event: "PROFILE_ERROR",
            message: error.message,
            userId:
                req.user?.userId || null,
            ip:
                req.ip
        });

        return res.status(500).json({
            success: false,
            message:
                "Unable to retrieve profile."
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getProfile
};