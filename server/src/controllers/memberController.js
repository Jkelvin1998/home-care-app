import FamilyMember from '../models/FamilyMember.js';
import HealthRecord from '../models/HealthRecord.js';

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
   const members = await FamilyMember.find({ userId: req.user.id }).sort({
      createdAt: 1,
   });

   return res.json(members.map(normalize));
}

export async function createMember(req, res) {
   const { name, dateOfBirth, gender, weightKg, heightCm, profileImage } =
      req.body;

   if (!name || !dateOfBirth || !gender) {
      return res
         .status(400)
         .json({ message: 'Missing required member fields' });
   }

   const member = await FamilyMember.create({
      userId: req.user.id,
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
   const updated = await FamilyMember.findOneAndUpdate(
      {
         _id: id,
         userId: req.user.id,
      },
      req.body,
      { new: true },
   );

   if (!updated) {
      return res.status(404).json({ message: 'Member not found' });
   }

   return res.json(normalize(updated));
}

export async function deleteMember(req, res) {
   const { id } = req.params;
   const member = await FamilyMember.findOneAndDelete({
      _id: id,
      userId: req.user.id,
   });

   if (!member) {
      return res.status(404).json({ message: 'Member not found' });
   }

   await HealthRecord.deleteMany({ userId: req.user.id, memberId: id });
   return res.status(204).send();
}
