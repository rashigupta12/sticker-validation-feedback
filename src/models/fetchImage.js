import mongoose from 'mongoose';

const StickerSchema = new mongoose.Schema({
  uuid: String,
  filename: String,
  gcsUri: String,
  political: Boolean,
  cultural: Boolean,
  linguistic: Boolean,
  demographics: Boolean,
  comment: { type: String, default: "" },
  folder: String,
  publicurl: String,
  pass: { type: Boolean, default: false },  // Corrected
  discard: { type: Boolean, default: false },  // Corrected
}, { timestamps: true });

const Sticker = mongoose.models.Sticker || mongoose.model('Sticker', StickerSchema, 'stickers');

export default Sticker;
