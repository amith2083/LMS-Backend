import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../constants/http";
import { AppError } from "../utils/asyncHandler";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  console.log('accesstoken',accessToken)

  if (!accessToken) {
     // Use next() to pass the error to global handler
    return next(new AppError(401, "Access token is required"));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string);
    req.user = decoded;
    console.log('🤗😁',req.user)
    next();
  } catch (error) {
   return next(new AppError(401, "Invalid or expired access token"));
  }
};





// import { Request, Response, NextFunction } from "express";
// // import { getToken } from "next-auth/jwt";
// import { jwtDecrypt } from 'jose'
// import { STATUS_CODES } from "../constants/http";
// import { ERROR_MESSAGES } from "../constants/messages";
// import { AppError } from "../utils/asyncHandler";

// export interface AuthenticatedRequest extends Request {
//   user?: { id: string; role: string; isVerified?: boolean; isBlocked?: boolean };
// }

// export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const token = req.cookies["authjs.session-token"];
//   console.log("Backend: Received cookie:", {
//     cookie: req.cookies["authjs.session-token"],
//   });
// //   console.log('req',req)
//   if (!token) {
//     throw new AppError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
//   }

//   try {
//     console.log(process.env.AUTH_SECRET)
   
//     // const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as {
//     //   id: string;
//     //   role: string;
//     //   isVerified?: boolean;
//     //   isBlocked?: boolean;
//     //   iat?: number;
//     //   exp?: number;
//     //   jti?: string;
//     // };
//   // const decoded = await getToken({
//   //     req,
//   //     secret: process.env.AUTH_SECRET, // amihello
//   //     secureCookie: process.env.NODE_ENV === "production",
      
//   //   });

// const secret = new TextEncoder().encode(process.env.AUTH_SECRET); // amihello

// //  const secret = Buffer.from(process.env.AUTH_SECRET!, "base64");

//     const { payload } = await jwtDecrypt(token, secret);
//     // const { payload } = await jwtDecrypt(token, secret);
// // const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
// console.log('payload',payload)

//     console.log("Backend: Decoded JWT:", {
//       id: payload.id,
//       role: payload.role,
//       isVerified: payload.isVerified,
//       isBlocked: payload.isBlocked,
//       sub: payload.sub,
//       iat: payload.iat,
//       exp: payload.exp,
//     });

//     if (payload.isBlocked) {
//       console.log("Backend: User is blocked");
//       throw new AppError(STATUS_CODES.FORBIDDEN, "User is blocked");
//     }

//     req.user = {
//       id: payload.id as string,
//       role: payload.role as string,
//       isVerified: payload.isVerified as boolean,
//       isBlocked: payload.isBlocked as boolean,
//     };
//     next();
//   } catch (error) {
//     console.error("JWT verification error:", error);
//     throw new AppError(STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
//   }
// };