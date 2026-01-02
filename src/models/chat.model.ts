import mongoose, { Document, Schema, Types } from "mongoose";
import { ChatPermissions } from "../types/chat";
const env = process.env;

export interface IParticipant {
  userId: Types.ObjectId;
  role: "owner" | "admin" | "member";
  permissions: ChatPermissions;
}

export interface IChat extends Document {
  chatType: "group" | "personal";
  gatheringId?: Types.ObjectId;
  participants: IParticipant[];
  createdBy: Types.ObjectId;
}

const ParticipantSchema = new Schema<IParticipant>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["owner", "admin", "member"], default: "member" },
  permissions: {
    sendText: { type: Boolean, default: true },
    sendMedia: { type: Boolean, default: true },
    sendDocument: { type: Boolean, default: true },
    deleteMessage: { type: Boolean, default: false },
    pinMessage: { type: Boolean, default: false },
    reactMessage: { type: Boolean, default: true },
    createPoll: { type: Boolean, default: false },
    startVoiceChat: { type: Boolean, default: false },
    muteOthers: { type: Boolean, default: false },
    kickMembers: { type: Boolean, default: false },
    allowToSpeak: { type: Boolean, default: false },
    addToCalendar: { type: Boolean, default: false },
  },
});

const ChatSchema = new Schema<IChat>(
  {
    chatType: { type: String, enum: ["group", "personal"], required: true },
    gatheringId: { type: Schema.Types.ObjectId, ref: "Gathering" },
    participants: [ParticipantSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const Chat = dbConnection.model('Chat', ChatSchema, 'Chat');
