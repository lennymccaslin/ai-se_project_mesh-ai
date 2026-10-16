 import rateLimit from 'express-rate-limit';
 import { isProduction } from '../utils/logger.js';

 export const loginLimiter = rateLimit({
    skip: () => !isProduction,
     windowMs: 20 * 60 * 1000,
     max: 10,
     message: {
     success: false,
     data: null,
     error: { message: 'Too many requests, please try again later.' },
     },
 });

  export const registerLimiter = rateLimit({
    skip: () => !isProduction,
     windowMs: 30 * 60 * 1000,
     max: 5,
     message: {
     success: false,
     data: null,
     error: { message: 'Too many requests, please try again later.' },
     },
 });