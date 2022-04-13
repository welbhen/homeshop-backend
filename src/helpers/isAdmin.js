export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == 1) {
        return next();
    } else {
        res.json({
            error: false,
            message: "Your must be an Admin to access this section!"
        });
        res.redirect('/');
    }
}