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
      changedAt: entry.createdAt.toISOString(),
   };
}

async function createHistoryEntryBestEffort({ record, action, actorUserId }) {
   try {
      const actor = await User.findById(actorUserId).select('_id name');

      await RecordHistory.create({
         userId: record.userId,
         memberId: record.memberId,
         recordId: record._id,
         action,
         actorId: actor?._id ?? actorUserId,
         actorName: actor?.name ?? 'Unknown User',
         snapshot: {
            savedAt: record.savedAt,
            temperature: record.temperature,
            oxygen: record.oxygen,
            pulseRate: record.pulseRate,
            symptoms: record.symptoms ?? [],
         },
      });
   } catch (error) {
      console.error('Failed to write record history', {
         action,
         recordId: record?._id?.toString?.(),
         actorId: actorUserId,
         error: error instanceof Error ? error.message : String(error),
      });
   }
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
   const { memberId, limit } = req.query;

   const ownerId = await resolveOwnerId(req);

   if (!ownerId) {
      return res.status(403).json({ message: 'Access denied for care owner' });
   }

   const query = { userId: ownerId };

   if (memberId) query.memberId = memberId;

   const parsedLimit = Number.parseInt(limit, 10);
   const safeLimit = Number.isNaN(parsedLimit)
      ? 25
      : Math.max(1, Math.min(parsedLimit, 100));

   const historyEntries = await RecordHistory.find(query)
      .sort({ createdAt: -1 })
      .limit(safeLimit);

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

   await createHistoryEntryBestEffort({
      record,
      action: 'created',
      actorUserId: req.user.id,
   });

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

   await createHistoryEntryBestEffort({
      record,
      action: 'updated',
      actorUserId: req.user.id,
   });

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

   await record.deleteOne();

   await createHistoryEntryBestEffort({
      record,
      action: 'deleted',
      actorUserId: req.user.id,
   });

   return res.status(204).send();
}
