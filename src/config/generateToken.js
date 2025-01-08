import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId,role,res)=>{
    const token = jwt.sign(
        {userId , role}, 
        process.env.JWT_SECRET,
        {expiresIn : "2h"}
    );
    res.cookie("jwtCookie",token,{
        maxAge:  2 * 60 * 60 * 1000, //10 days  in MiliSecond
		httpOnly: true, // pookie is not accessible via JavaScript (like document.cookie)  || (prevents XSS attacks)
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",  //Send cookie over HTTPS only in devlopement
    })
    return token;      //if token needed
}