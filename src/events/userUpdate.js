module.exports = async function userUpdate (Kirito, [oldUser, newUser]) {
    //Update DB on username change
    if (Kirito.users_.has(oldUser.id)) {
        let user = Kirito.users_.get(oldUser.id);
        user.username = newUser.username;
        Kirito.users_.set(user.id,user);
    }
}
