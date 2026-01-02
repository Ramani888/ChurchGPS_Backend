export interface ChatPermissions {
  sendText: boolean;
  sendMedia: boolean;
  sendDocument: boolean;
  deleteMessage: boolean;
  pinMessage: boolean;
  reactMessage: boolean;
  createPoll: boolean;
  startVoiceChat: boolean;
  muteOthers: boolean;
  kickMembers: boolean;
  allowToSpeak: boolean;
  addToCalendar: boolean;
}
