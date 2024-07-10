const mongoose = require("mongoose");
const validator = require("validator"); // using a 3rd party package for validation
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxLength: 50,
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    validate: {
      validator: function (v) {
        return validator.isStrongPassword(v, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: false,
        });
      },
      message: `Password must contain minimum 8 characters and at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol`,
    },
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

// need to use function key word and not arrow funct for correct functioning of this keyword
UserSchema.pre("save", async function () {
  // console.log("modifiedPaths", this.modifiedPaths());
  // checks the modified fields and returns early if password is not updated
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// removed - refactored to utils
// UserSchema.methods.createJWT = function () {
//   return jwt.sign(
//     { userId: this._id, name: this.name, email: this.email, role: this.role },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_LIFETIME,
//     }
//   );
// };

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);

  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
