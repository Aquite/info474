const Schema = require("mongoose").Schema;

const channelSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true, unique: false },
  private: { type: Boolean, required: true },
  members: [{ uid: { type: String }, email: { type: String } }],
  createdAt: { type: Date, required: true, unique: false },
  creator: { uid: { type: String }, email: { type: String } },
  editedAt: { type: Date, required: false, unique: false },
});

const messageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  channelOd: { type: String, required: true, unique: true },
  body: { type: String, required: true, unique: false },
  createdAt: { type: Date, required: true, unique: false },
  creator: { uid: { type: String }, email: { type: String } },
  editedAt: { type: Date, required: false, unique: false },
});

module.exports = { channelSchema, messageSchema };
