//collect and export  user data only for now
const User = require('./User');

const Post = require('./Post');

//make this one to many association
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
})

module.exports ={ User, Post };