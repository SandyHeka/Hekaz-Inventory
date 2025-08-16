import { Schema } from "mongoose";

export default function softDelete(schema: Schema) {
  schema.add({
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  });

  const addNotDeleted = function (this: any) {
    const q = this.getQuery();
    if (q.deletedAt === undefined) this.where({ deletedAt: null });
  };

  schema.pre("find", addNotDeleted);
  schema.pre("findOne", addNotDeleted);
  schema.pre("countDocuments", addNotDeleted);
  schema.pre("findOneAndUpdate", addNotDeleted);
  schema.pre("aggregate", function (this: any) {
    const pipe = this.pipeline();
    const alreadyFilters = pipe.some(
      (s: any) => s.$match?.deletedAt !== undefined
    );
    if (!alreadyFilters) pipe.unshift({ $match: { deletedAt: null } });
  });

  schema.methods.softDelete = function (userId?: string) {
    this.deletedAt = new Date();
    this.deletedBy = userId || null;
    return this.save();
  };

  schema.methods.restore = function () {
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  };
}
