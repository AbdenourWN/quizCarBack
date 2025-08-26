const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const roleModel = require("../models/roleModel");
const permissionModel = require("../models/permissionModel");
const featureModel = require("../models/featureModel");

const requireAuth = async (req, res, next, featureName) => {
  // verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await userModel.findOne({ _id });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const role = await roleModel.findOne({ _id: user.role });
    if (!role) {
      return res.status(401).json({ error: "Role not found" });
    }
    const permissions = await permissionModel.find({ role: role._id });
    let permission;
    for (const per of permissions) {
      const feature = await featureModel.findById(per.feature);
      if (feature?.feature === featureName) {
        permission = per;
        break;
      }
    }
    req.user = { user, role, permission };
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized", err: error.message });
  }
};

module.exports = requireAuth;
