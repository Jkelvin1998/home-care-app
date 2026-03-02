import FamilyMember from '../models/FamilyMember.js';
import HealthRecord from '../models/HealthRecord.js';
import { canAccessOwner, resolveOwnerId } from '../utils/access.js';

function normalize(member) {
   return {
      id: member._id.toString(),
      name: member.name,
      dateOfBirth: member.dateOfBirth,
      gender: member.gender,
      weightKg: member.weightKg,
      heightCm: member.heightCm,
      profileImage: member.profileImage,
   };
}

export async function listMembers(req, res) {
   const ownerId = await resolveOwnerId(req);

   if (!ownerId) {
      return res.status(403).json({ message: 'Access denied for care owner' });
   }

   const members = await FamilyMember.find({ userId: ownerId }).sort({
      createdAt: 1,
   });

   return res.json(members.map(normalize));
}

export async function createMember(req, res) {
   const { name, dateOfBirth, gender, weightKg, heightCm, profileImage } =
      req.body;

   if (!name || !dateOfBirth || !gender || !weightKg || !heightCm) {
      return res
         .status(400)
         .json({ message: 'Missing required member fields' });
   }

   const ownerId = await resolveOwnerId(req);

   if (!ownerId) {
      return res.status(403).json({ message: 'Access denied for care owner' });
   }

   const member = await FamilyMember.create({
      userId: ownerId,
      name,
      dateOfBirth,
      gender,
      weightKg,
      heightCm,
      profileImage,
   });

   return res.status(201).json(normalize(member));
}

export async function updateMember(req, res) {
   const { id } = req.params;
   const allowedFields = [
      'name',
      'dateOfBirth',
      'gender',
      'weightKg',
      'heightCm',
      'profileImage',
   ];

   const updatePayload = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
   );

   if (Object.keys(updatePayload).length === 0) {
      return res
         .status(400)
         .json({ message: 'No valid fields provided for update' });
   }

   const member = await FamilyMember.findById(id);

   if (!member) {
      return res.status(404).json({ message: 'Record not found' });
   }

   const allowed = await canAccessOwner(req.user.id, member.userId.toString());

   if (!allowed) {
      return res.status(403).json({ message: 'Access denied for member' });
   }

   Object.assign(member, updatePayload);
   await member.save();

   return res.json(normalize(member));
}

export async function deleteMember(req, res) {
   const { id } = req.params;
   const member = await FamilyMember.findById(id);

   if (!member) {
      return res.status(404).json({ message: 'Member not found' });
   }

   const ownerId = member.userId.toString();
   const allowed = await canAccessOwner(req.user.id, ownerId);

   if (!allowed) {
      return res.status(403).json({ message: 'Access denied for member' });
   }

   await member.deleteOne();
   await HealthRecord.deleteMany({ userId: ownerId, memberId: id });
   return res.status(204).send();
}
