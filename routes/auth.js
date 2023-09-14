const express = require("express");
const router = new express.Router();
const  expressError = require("../ExpressError");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");




/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async (req, res, next) => {
    try{
        const {username, password} = req.body;
        const result = await User.authenticate({username, password});
        let user = result.rows[0];

        if(user){
            User.updateLoginTimestamp(user.username);
            let token = jwt.sign({ username }, SECRET_KEY);
            return res.json({ token });
        }
        throw new ExpressError("Invalid user/password", 400);

    }catch(e){
        return next(e)
    }
})
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async (req, res, next) =>{
  try {  const {username, password, first_name, last_name, phone} = req.body;
    const result = await User.register({username, password, first_name, last_name, phone});
    let user = result.rows[0];

    if(user){
        User.updateLoginTimestamp(user.username);
        let token = jwt.sign({ username }, SECRET_KEY);
            return res.json({ token }); 
    }
    throw new ExpressError("Invalid user/password", 400);
} catch(e){
    return next(e);
}
})

module.exports = router;