import { hash, verify } from "argon2"; 
import User from "../user/user.model.js"; 
import { generateJWT } from "../helpers/generate-jwt.js"; 

export const login = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
                error: "User or email does not exist"
            });
        }

        const validPassword = await verify(user.password, password);

        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid credentials",
                error: "Incorrect password"
            });
        }

        const token = await generateJWT(user.id);

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Login failed, server error",
            error: err.message
        });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;

        data.role = "ADMIN_ROLE";

        const user = await User.create(data);

        return res.status(201).json({
            message: "Admin user has been created",
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        return res.status(500).json({
            message: "Admin registration failed",
            error: err.message
        });
    }
};

export const register = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;

        const user = await User.create(data);

        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        return res.status(500).json({
            message: "User registration failed",
            error: err.message
        });
    }
};

