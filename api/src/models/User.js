const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    resetLink: {
      type: String,
      default: ""
    },
    admin: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "default_image",
    },
    description: {
      type: String,
    },
    country: {
      type: String,
    },
    selling_books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    purchased_books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      }
    ],
    wish_list: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    log_Google: {
      type: Boolean,
      default: false,
    },
    localStorageToken: {
      type: String
    },
    available_money: {
      type: Number,
      min: 0,
      default: 500,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("User", userSchema);