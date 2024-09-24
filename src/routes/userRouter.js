import { Router } from "express";
const router = Router();
import * as controller from "../controllers/userController.js"
import passport from "passport";

router.post("/login", passport.authenticate('login'), controller.loginResponse);
router.post('/register', passport.authenticate('register'), controller.registerResponse)
router.get('/info', controller.infoSession);
router.post("/logout", controller.logout);
router.get('/register-github', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/premium/:id' , controller.premium);
router.get('/' , controller.getUsers);
router.delete('/' , controller.deleteUsers);


router.get('/profile', passport.authenticate( 'github' , {
    failureRedirect: '/login', 
    successRedirect: '/profile-github', 
    passReqToCallback: true
}));

router.get('/logout-github', (req, res) => {
    req.logout((err) => {
        if (err) res.send(err);
        res.redirect('/login'); 
      });
});
export default router;