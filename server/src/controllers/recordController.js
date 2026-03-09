import FamilyMember from '../models/FamilyMember.js';
import HealthRecord from '../models/HealthRecord.js';
import User from '../models/User.js';
import RecordHistory from '../models/RecordHistory.js';
import { canAccessOwner, resolveOwnerId } from '../utils/access.js';

function normalize(record) {
   return {
      id: record._id.toString(),
      memberId: record.memberId.toString(),
      savedAt: record.savedAt,
      temperature: record.temperature,
      oxygen: record.oxygen,
      pulseRate: record.pulseRate,
      symptoms: record.symptoms ?? [],
   };
}

function normalizeHistoryEntry(entry) {
   return {
      id: entry._id.toString(),
      memberId: entry.memberId.toString(),
      recordId: entry.recordId.toString(),
      action: entry.action,
      actorId: entry.actorId.toString(),
      actorName: entry.actorName,
      snapshot: {
         savedAt: entry.snapshot.savedAt,
         temperature: entry.snapshot.temperature,
         oxygen: entry.snapshot.oxygen,
         pulseRate: entry.snapshot.pulseRate,
         symptoms: entry.snapshot.symptoms ?? [],
      },
      changedAt: entry.createdAt.toString(),
   };
}

async function createHistoryEntry({ record, action, actor }) {
   await RecordHistory.create({
      userId: record.userId,
      memberId: record.memberId,
      recordId: record._id,
      action,
      actorId: actor._id,
      actorName: actor.name,
      snapshot: {
         savedAt: record.savedAt,
         temperature: record.temperature,
         oxygen: record.oxygen,
         pulseRate: record.pulseRate,
         symptoms: record.symptoms ?? [],
      },
   });
}

export async function listRecords(req, res) {
   const { memberId } = req.query;

   const ownerId = await resolveOwnerId(req);

   if (!ownerId) {
      return res.status(403).json({ message: 'Access denied for care owner' });
   }

   const query = { userId: ownerId };

   if (memberId) query.memberId = memberId;

   const records = await HealthRecord.find(query).sort({ savedAt: -1 });
   return res.json(records.map(normalize));
}

export async function listRecordHistory(req, res) {
   const { memberId } = req.query;

   const ownerId = await resolveOwnerId(req);

   if (!ownerId) {
      return res.status(403).json({ message: 'Access denied for care owner' });
   }

   const query = { userId: ownerId };

   if (memberId) query.memberId = memberId;

   const historyEntries = await RecordHistory.find(query).sort({
      createdAt: -1,
   });

   return res.json(historyEntries.map(normalizeHistoryEntry));
}

export async function createRecord(req, res) {
   const { memberId, savedAt, temperature, oxygen, pulseRate, symptoms } =
      req.body;

   if (!memberId) {
      return res.status(400).json({ message: 'memberId is required' });
   }

   const member = await FamilyMember.findById(memberId).select('_id userId');

   if (!member) {
      return res.status(404).json({ message: 'Member not found' });
   }

   const ownerId = member.userId.toString();
   const allowed = await canAccessOwner(req.user.id, ownerId);

   if (!allowed) {
      return res.status(403).json({ message: 'Access denied for member' });
   }

   const record = await HealthRecord.create({
      userId: ownerId,
      memberId,
      savedAt: savedAt ?? new Date().toISOString(),
      temperature,
      oxygen,
      pulseRate,
      symptoms: symptoms ?? [],
   });

   const actor = await User.findById(req.user.id).select('_id name');

   if (actor) {
      await createHistoryEntry({
         record,
         action: 'created',
         actor,
      });
   }

   return res.status(201).json(normalize(record));
}

export async function updateRecord(req, res) {
   const { id } = req.params;
   const { temperature, oxygen, pulseRate, symptoms } = req.body;
   const record = await HealthRecord.findById(id);

   if (!record) {
      return res.status(404).json({ message: 'Record not found' });
   }

   const allowed = await canAccessOwner(req.user.id, record.userId.toString());

   if (!allowed) {
      return res.status(403).json({ message: 'Access denied for record' });
   }

   const hasUpdates = [temperature, oxygen, pulseRate, symptoms].some(
      (value) => value !== undefined,
   );

   if (!hasUpdates) {
      return res
         .status(400)
         .json({ message: 'No valid fields provided for update' });
   }

   if (temperature !== undefined) record.temperature = temperature;
   if (oxygen !== undefined) record.oxygen = oxygen;
   if (pulseRate !== undefined) record.pulseRate = pulseRate;
   if (symptoms !== undefined) record.symptoms = symptoms;
   await record.save();

   const actor = await User.findById(req.user.id).select('_id name');

   if (actor) {
      await createHistoryEntry({
         record,
         action: 'updated',
         actor,
      });
   }

   return res.json(normalize(record));
}

export async function deleteRecord(req, res) {
   const { id } = req.params;
   const record = await HealthRecord.findById(id);

   if (!record) {
      return res.status(404).json({ message: 'Record not found' });
   }

   const allowed = await canAccessOwner(req.user.id, record.userId.toString());

   if (!allowed) {
      return res.status(403).json({ message: 'Access denied for record' });
   }

   const actor = await User.findById(req.user.id).select('_id name');

   if (actor) {
      await createHistoryEntry({
         record,
         action: 'deleted',
         actor,
      });
   }

   await record.deleteOne();

   return res.status(204).send();
}
