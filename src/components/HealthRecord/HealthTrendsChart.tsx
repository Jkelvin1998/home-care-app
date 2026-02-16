import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import type { Health } from '../../types/health';
import { formatDate, formatTime } from '../../utils/utils';

type HealthTrendsChartProps = {
   records: Health[];
   selectedMemberId: string;
};

type MetricKey = 'temperature' | 'oxygen' | 'pulseRate';

type MetricConfig = {
   key: MetricKey;
   label: string;
   color: string;
   unit: string;
};

const createUniqueTimeLabels = (records: Health[]) => {
   const seenLabels = new Map<string, number>();

   return records.map((record, index) => {
      const baseLabel = `${formatDate(record.savedAt)} ${formatTime(record.savedAt)}`;
      const seenCount = seenLabels.get(baseLabel) ?? 0;
      seenLabels.set(baseLabel, seenCount + 1);

      if (seenCount === 0) return baseLabel;
      return `${baseLabel} #${index + 1}`;
   });
};

const metrics: MetricConfig[] = [
   { key: 'temperature', label: 'Temperature', color: '#ef4444', unit: '°C' },
   { key: 'oxygen', label: 'Oxygen', color: '#2563eb', unit: '%' },
   { key: 'pulseRate', label: 'Pulse Rate', color: '#9333ea', unit: 'bpm' },
];

const previewXAxis = ['Point 1', 'Point 2', 'Point 3', 'Point 4'];

const getPreviewValues = (key: MetricKey) => {
   if (key === 'temperature') return [36.4, 36.6, 36.5, 36.7];

   if (key === 'oxygen') return [97, 98, 98, 97];

   return [74, 76, 75, 77];
};

export default function HealthTrendsChart({
   records,
   selectedMemberId,
}: HealthTrendsChartProps) {
   const memberRecords = records
      .filter((record) => record.memberId === selectedMemberId)
      .sort(
         (a, b) =>
            new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime(),
      );

   const hasSelectedMember = Boolean(selectedMemberId);
   const hasRecords = memberRecords.length > 0;

   const xLabels = hasRecords
      ? createUniqueTimeLabels(memberRecords)
      : previewXAxis;
   const latestDate = hasRecords
      ? xLabels[xLabels.length - 1]
      : 'No records yet';

   return (
      <Stack spacing={2} sx={{ mt: 2 }}>
         {!hasSelectedMember && (
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
               Select a family member to view real trends. A preview is shown
               below.
            </Typography>
         )}

         {hasSelectedMember && !hasRecords && (
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
               No health records yet. Preview lines are displayed until your
               first saved record.
            </Typography>
         )}

         {metrics.map((metric) => {
            const values = hasRecords
               ? memberRecords.map((record) => record[metric.key])
               : getPreviewValues(metric.key);
            const latestValue = values[values.length - 1];
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);

            return (
               <Card
                  key={metric.key}
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
               >
                  <CardContent>
                     <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        mb={1.25}
                     >
                        <Typography
                           variant="subtitle2"
                           fontWeight={700}
                           color="text.primary"
                        >
                           {metric.label} Trend
                        </Typography>
                        <Chip
                           size="small"
                           label={
                              hasRecords
                                 ? `Latest: ${latestValue}${metric.unit}`
                                 : 'Preview'
                           }
                           sx={{
                              bgcolor: hasRecords ? `grey.100` : 'blue.50',
                              fontWeight: 600,
                           }}
                        />
                     </Stack>

                     <LineChart
                        height={220}
                        margin={{ left: 50, right: 20, top: 20, bottom: 36 }}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                        series={[
                           {
                              data: values,
                              color: metric.color,
                              curve: 'monotoneX',
                              label: metric.label,
                              showMark: true,
                           },
                        ]}
                     />
                     <Box
                        sx={{
                           mt: 1,
                           display: 'flex',
                           flexWrap: 'wrap',
                           gap: 1,
                        }}
                     >
                        <Chip
                           size="small"
                           label={`Min: ${minValue}${metric.unit}`}
                        />
                        <Chip
                           size="small"
                           label={`Max: ${maxValue}${metric.unit}`}
                        />
                        <Chip
                           size="small"
                           label={`Records: ${memberRecords.length}`}
                        />
                        <Chip
                           size="small"
                           label={`Latest date: ${latestDate}`}
                        />
                     </Box>
                  </CardContent>
               </Card>
            );
         })}
      </Stack>
   );
}
