module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });
  };

  return Posts;
};
