const { Schema, model } = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    genres: [
      {
        type: Schema.Types.String,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    used: {
      type: Boolean,
      required: true,
    },
    released: {
      type: String,
      required: true,
    },
    pageCount: {
      type: Number,
    },
    language: {
      type: String,
    },
    book_type: {
      type: String,
    },
    sellers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.plugin(mongoosePagination);

module.exports = model("Book", bookSchema);
