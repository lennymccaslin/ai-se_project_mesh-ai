import type { Request, Response } from 'express';
import User from '../models/user.js';

export const getCurrentUser = async (
 req: Request,
 res: Response,
): Promise<void> => {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
    res.status(404).json({
    success: false,
    data: null,
    error: { message: 'User not found' }
    });
    return;
    } else {
    res.status(200).json({
    success: true,
    data: {
        userId: user._id,
        email: user.email,
        name: user.name,
    },
    error: null,
    });
    return;
}
}