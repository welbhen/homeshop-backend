export function isUser(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.json({
            error: false,
            message: "Your must be registered!"
        });
        res.redirect('/register');
    }
}