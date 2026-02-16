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

   if (!selectedMemberId) {
      return (
         <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: 14 }}>
            Select a family member to view health trends.
         </Typography>
      );
   }

   if (memberRecords.length < 2) {
      return (
         <Typography sx={{ mt: 1.5, color: 'text.secondary', fontSize: 14 }}>
            Add at least two records to visualize temperature, oxygen, and pulse
            trends.
         </Typography>
      );
   }

   const xLabels = createUniqueTimeLabels(memberRecords);
   const latestDate = `${formatDate(memberRecords[memberRecords.length - 1].savedAt)} ${formatTime(memberRecords[memberRecords.length - 1].savedAt)}`;

   return (
      <Stack spacing={2} sx={{ mt: 2 }}>
         {metrics.map((metric) => {
            const values = memberRecords.map((record) => record[metric.key]);
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
                           label={`Latest: ${latestValue}${metric.unit}`}
                           sx={{ bgcolor: `grey.100`, fontWeight: 600 }}
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
                           label={`Records: ${values.length}`}
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
