import HealthRecord from '../models/HealthRecord.js';

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

export async function listRecords(req, res) {
   const { memberId } = req.query;
   const query = { userId: req.user.id };

   if (memberId) query.memberId = memberId;

   const records = await HealthRecord.find(query).sort({ savedAt: -1 });
   return res.json(records.map(normalize));
}

export async function createRecord(req, res) {
   const { memberId, savedAt, temperature, oxygen, pulseRate, symptoms } =
      req.body;

   if (!memberId) {
      return res.status(400).json({ message: 'memberId is required' });
   }

   const record = await HealthRecord.create({
      userId: req.user.id,
      memberId,
      savedAt: savedAt ?? new Date().toISOString(),
      temperature,
      oxygen,
      pulseRate,
      symptoms: symptoms ?? [],
   });

   return res.status(201).json(normalize(record));
}

export async function updateRecord(req, res) {
   const { id } = req.params;
   const updated = await HealthRecord.findOneAndUpdate(
      {
         _id: id,
         userId: req.user.id,
      },
      req.body,
      { new: true },
   );

   if (!updated) {
      return res.status(404).json({ message: 'Record not found' });
   }

   return res.json(normalize(updated));
}

export async function deleteRecord(req, res) {
   const { id } = req.params;
   const deleted = await HealthRecord.findOneAndDelete({
      _id: id,
      userId: req.user.id,
   });

   if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
   }

   return res.status(204).send();
}
