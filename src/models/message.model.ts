import mongoose, { Document, Schema, Types } from "mongoose";
const env = process.env;

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: "text" | "image" | "video" | "document" | "poll" | "system";
  content: any;
  style?: {
    color?: string;
  };
  pinned: boolean;
  deletedAt?: Date | null;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["text", "image", "video", "document", "poll", "system"],
      required: true,
    },
    content: { type: Schema.Types.Mixed, required: true },
    style: {
      color: { type: String },
    },
    pinned: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const Message = dbConnection.model('Message', MessageSchema, 'Message');
