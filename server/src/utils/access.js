import mongoose from 'mongoose';
import CareAccess from '../models/CareAccess.js';

function toObjectId(value) {
   if (!value || !mongoose.Types.ObjectId.isValid(value)) return null;
   return new mongoose.Types.ObjectId(value);
}

export async function canAccessOwner(userId, ownerId) {
   if (!ownerId) return false;
   if (userId === ownerId) return true;

   const access = await CareAccess.findOne({
      ownerUserId: ownerId,
      collaboratorUserId: userId,
   }).select('_id');

   return Boolean(access);
}

export async function resolveOwnerId(req) {
   const requestedOwnerId =
      req.query.careOwnerId || req.body.careOwnerId || req.params.careOwnerId;

   if (!requestedOwnerId) {
      return req.user.id;
   }

   const parsed = toObjectId(requestedOwnerId)?.toString();

   if (!parsed) return null;
   if (await canAccessOwner(req.user.id, parsed)) return parsed;
   return null;
}
