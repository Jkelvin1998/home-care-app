import CareAccess from '../models/CareAccess.js';
import User from '../models/User.js';
import { resolveOwnerId } from '../utils/access.js';

function normalizeOwner(user, relationship) {
   return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      relationship,
   };
}

export async function listCareOwners(req, res) {
   const ownUser = await User.findById(req.user.id).select('_id name email');
   const accesses = await CareAccess.find({ collaboratorUserId: req.user.id })
      .populate('ownerUserId', '_id name email')
      .sort({ createdAt: -1 });

   const owners = [];

   if (ownUser) {
      owners.push(normalizeOwner(ownUser, 'owner'));
   }

   for (const access of accesses) {
      if (!access.ownerUserId) continue;
      owners.push(normalizeOwner(access.ownerUserId, 'shared'));
   }

   return res.json(owners);
}

export async function listCollaborators(req, res) {
   const ownerId = req.query.ownerId || req.user.id;
   const objectIdPattern = /^[a-f\d]{24}$/i;

   if (req.query.ownerId && !objectIdPattern.test(String(req.query.ownerId))) {
      return res.status(400).json({ message: 'Invalid ownerId' });
   }

   if (ownerId !== req.user.id) {
      const access = await CareAccess.findOne({
         ownerUserId: ownerId,
         collaboratorUserId: req.user.id,
      }).select('_id');

      if (!access) {
         return res
            .status(403)
            .json({ message: 'Access denied for care team' });
      }
   }

   const accesses = await CareAccess.find({ ownerUserId: ownerId })
      .populate('collaboratorUserId', '_id name email')
      .sort({ createdAt: -1 });

   return res.json(
      accesses
         .filter((a) => a.collaboratorUserId)
         .map((access) => ({
            id: access._id.toString(),
            userId: access.collaboratorUserId._id.toString(),
            name: access.collaboratorUserId.name,
            email: access.collaboratorUserId.email,
         })),
   );
}

export async function addCollaborator(req, res) {
   const { email, careOwnerId } = req.body;
   const objectIdPattern = /^[a-f\d]{24}$/i;

   if (!email) {
      return res
         .status(400)
         .json({ message: 'Collaborator email is required' });
   }

   if (careOwnerId && !objectIdPattern.test(String(careOwnerId))) {
      return res.status(400).json({ message: 'Invalid careOwnerId' });
   }

   const ownerId = await resolveOwnerId(req);

   if (!ownerId) {
      return res.status(403).json({ message: 'Access denied for care owner' });
   }

   const collaborator = await User.findOne({ email: email.toLowerCase() });

   if (!collaborator) {
      return res
         .status(404)
         .json({ message: 'User with that email was not found' });
   }

   if (collaborator._id.toString() === ownerId) {
      return res
         .status(400)
         .json({ message: 'You cannot add yourself as collaborator' });
   }

   const access = await CareAccess.findOneAndUpdate(
      {
         ownerUserId: ownerId,
         collaboratorUserId: collaborator._id,
      },
      {
         ownerUserId: ownerId,
         collaboratorUserId: collaborator._id,
         addedByUserId: req.user.id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
   );

   return res.status(201).json({
      id: access._id.toString(),
      userId: collaborator._id.toString(),
      name: collaborator.name,
      email: collaborator.email,
   });
}

export async function removeCollaborator(req, res) {
   const { id } = req.params;
   const objectIdPattern = /^[a-f\d]{24}/i;

   if (!objectIdPattern.test(String(id))) {
      return res.status(400).json({ message: 'Invalid Collaborator id' });
   }

   const access = await CareAccess.findOneAndDelete({
      _id: id,
      ownerUserId: req.user.id,
   }).populate('collaboratorUserId', '_id name email');

   if (!access) {
      return res.status(404).json({ message: 'Collaborator not found' });
   }

   return res.status(204).send();
}
