// Serialise documents the way the frontend expects: `id` instead of `_id`,
// no Mongoose version key, and never the password hash.
export function toClient(schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.passwordHash;
      return ret;
    },
  });
}
