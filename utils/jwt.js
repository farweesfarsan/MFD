const sendToken = (user,statuscode,res)=>{

    //Creating jwt token
    const token = user.getJwtToken();

    //Creating a cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE_DATE * 24 * 60 * 60 * 1000),
        httpOnly:true,
    }

    res.status(statuscode)
    .cookie('token',token,options)
    .json({
        success:true,
        token,
        user
    });
}

module.exports = sendToken;