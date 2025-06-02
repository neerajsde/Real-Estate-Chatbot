import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import resSender from "../utils/resSender.js";
import User from "../models/User.js";
import { redisClient } from "../config/redis.js";
import mailSender from "../utils/mailSender.js";
import sendUserWelcomeMail from "../mails/templates/userWelcome.js";
import {
    validateEmail, validatePassword
} from "../utils/validation.js";
import { imageUploader, deleteFile } from "../utils/fileUploader.js";

export async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return resSender(res, 400, false, 'All fields are required');
        }

        if(!validateEmail(email)) {
            return resSender(res, 400, false, 'Invalid email id');
        }

        let checkPassword = validatePassword(password);
        if (checkPassword !== true) {
            return resSender(res, 400, false, checkPassword);
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return resSender(res, 400, false, 'User already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        mailSender(
            email,
            'Welcome to ' + process.env.APP_NAME,
            sendUserWelcomeMail(name.split(' ')[0], email)
        );

        return resSender(res, 201, true, 'User created successfully');
    } catch (err) {
        console.log("Error in createUser:", err);
        return resSender(res, 500, false, err.message, 'Internal Server Error');
    }
}

export async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return resSender(res, 400, false, 'Email and password are required');
        }

        if(!validateEmail(email)) {
            return resSender(res, 400, false, 'Invalid email id');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return resSender(res, 404, false, 'User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return resSender(res, 401, false, 'Wrong Password');
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: 5 * 24 * 60 * 60
            }
        );

        // Set cookie with token
        res.cookie(process.env.TOKEN_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 24 * 60 * 60 * 1000 
        });

        let userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            profile_img: user.profile_img || '',
            isActive: user.isActive,
            terms_accepted: user.terms_accepted
        };

        await redisClient.setEx(`user:${user.id}`, 5 * 24 * 60 * 60, JSON.stringify(userData));

        return resSender(res, 200, true, 'Login successful');
    } catch (err) {
        console.log("Error in userLogin:", err);
        return resSender(res, 500, false, err.message, 'Internal Server Error');
    }
}

export async function updateUserDetails(req, res) {
    try {
        const userId = req.user.id;
        const {name, phone, terms_accepted} = req.body;
        const profile_img = req.files?.profile_img;

        const user = await User.findById(userId);
        if (!user) {
            return resSender(res, 404, false, 'User not found');
        }
        if(profile_img){
            if(user.profile_img) {
                // Delete old profile image if it exists
                const deleteOldImage = await deleteFile('profile_img', user.profile_img.split('/').pop());
                if(!deleteOldImage.flag) {
                    return resSender(res, 400, false, deleteOldImage.message);
                }
            }
            const uploadImage = await imageUploader(
                "profile_img",
                profile_img,
                { width: 200, height: 200, quality: 80 }
            );
            if(!uploadImage.flag) {
                return resSender(res, 400, false, uploadImage.message);
            }
            user.profile_img = uploadImage.url;
        }
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (terms_accepted !== undefined) user.terms_accepted = terms_accepted;
        if (terms_accepted !== undefined && !terms_accepted) {
            return resSender(res, 400, false, 'You must accept the terms and conditions');
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: user },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            throw new Error("User not found");
        }

        const key = `user:${updatedUser.id}`;
        // Get remaining TTL in seconds
        const ttl = await redisClient.ttl(key);
        if (ttl > 0) {
            let userData = {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profile_img: updatedUser.profile_img || '',
                isActive: updatedUser.isActive,
                terms_accepted: updatedUser.terms_accepted
            };
            // Update the user data in Redis
            await redisClient.setEx(key, ttl, JSON.stringify(userData));
        }

        return resSender(res, 200, true, 'User details updated successfully', updatedUser);
    } catch (error) {
        return resSender(res, 500, false, error.message || "Failed to update user details");
    }
};

export async function getUserDetails(req, res) {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return resSender(res, 404, false, 'User not found');
        }

        return resSender(res, 200, true, 'User details fetched successfully', user);
    } catch (err) {
        console.log("Error in getUserDetails:", err);
        return resSender(res, 500, false, err.message, 'Internal Server Error');
    }
}

export async function deleteUser(req, res) {
    try {
        const userId = req.user.id;

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return resSender(res, 404, false, 'User not found');
        }

        // Optionally clear user data from Redis
        await redisClient.del(`user:${userId}`);

        return resSender(res, 200, true, 'User deleted successfully');
    } catch (err) {
        console.log("Error in deleteUser:", err);
        return resSender(res, 500, false, err.message, 'Internal Server Error');
    }
}

export async function logoutUser(req, res) {
    try {
        // Clear the cookie
        res.clearCookie(process.env.TOKEN_NAME);

        // Optionally clear user data from Redis
        const userId = req.user.id;
        await redisClient.del(`user:${userId}`);

        return resSender(res, 200, true, 'Logout successful');
    } catch (err) {
        console.log("Error in logoutUser:", err);
        return resSender(res, 500, false, err.message, 'Internal Server Error');
    }
}

export async function changePassword(req, res) {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return resSender(res, 400, false, 'Old and new passwords are required');
        }

        const validNewPassword = validatePassword(newPassword);
        if(validNewPassword !== true) {
            return resSender(res, 400, false, validNewPassword);
        }

        const user = await User.findById(userId);
        if (!user) {
            return resSender(res, 404, false, 'User not found');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return resSender(res, 401, false, 'Old password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedNewPassword;
        await user.save();

        return resSender(res, 200, true, 'Password changed successfully');
    } catch (err) {
        console.log("Error in changePassword:", err);
        return resSender(res, 500, false, err.message, 'Internal Server Error');
    }
}

// Get user preferences
export async function getUserPreferences(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('preferences');

    if (!user) {
      return resSender(res, 404, false, 'User not found');
    }

    return resSender(res, 200, true, 'User preferences fetched successfully', user.preferences);
  } catch (err) {
    console.error("Error while getting user preferences:", err.message);
    return resSender(res, 500, false, 'Server error while fetching preferences');
  }
}

// Update user preferences
export async function updateUserPreferences(req, res) {
  try {
    const userId = req.user.id;
    const { location, budget, bedrooms, size_sqft, amenities = [] } = req.body;

    // Basic validation
    if (!location || !budget || !bedrooms || !size_sqft) {
      return resSender(res, 400, false, 'All fields (location, budget, bedrooms, size_sqft) are required');
    }

    // Normalize amenities input
    const normalizedAmenities = Array.isArray(amenities)
      ? amenities.map(item => item.toString().trim())
      : [];

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          preferences: {
            location: location.trim(),
            budget: Number(budget),
            bedrooms: Number(bedrooms),
            size_sqft: Number(size_sqft),
            amenities: normalizedAmenities,
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return resSender(res, 404, false, 'User not found');
    }

    return resSender(res, 200, true, 'Preferences updated successfully', updatedUser.preferences);
  } catch (err) {
    console.error("Error while updating user preferences:", err.message);
    return resSender(res, 500, false, 'Server error while updating preferences');
  }
}