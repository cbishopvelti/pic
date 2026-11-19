import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { calculateIncomePerYear, calculateProfitPercent } from '../calculator/calc';

const pounds = (n) =>
  `£${Math.round(n || 0).toLocaleString('en-GB')}`;

const yieldColor = (percent) => {
  if (percent >= 10) return 'success';
  if (percent >= 0) return 'warning';
  return 'error';
};

const Fact = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" component="div">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600} component="div">
      {value}
    </Typography>
  </Box>
);

const PropertyCard = ({ property, selected, href }) => {
  const rooms = property.rooms || [];
  const profit = calculateProfitPercent(property);
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderWidth: 2,
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'action.selected' : 'background.paper',
        transition: 'border-color 120ms, background-color 120ms',
      }}
    >
      <CardActionArea
        href={href}
        aria-current={selected ? 'page' : undefined}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
              {property.name}
            </Typography>
            <Chip
              size="small"
              color={yieldColor(profit)}
              label={`${isFinite(profit) ? profit : '–'}%`}
              title="Profit on capital per year"
            />
          </Stack>
          <Stack direction="row" spacing={2} mt={1}>
            <Fact label="Price" value={pounds(property.priceOfProperty)} />
            <Fact label="Rent / year" value={pounds(calculateIncomePerYear(property))} />
            <Fact label={rooms.length === 1 ? 'Unit' : 'Rooms'} value={rooms.length} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// Shows properties as cards with the key facts, and marks the selected one.
// It only takes a list and a selected id, so it does not care where the
// properties come from.
const PropertyPicker = ({ properties, selectedId, loading, hrefFor }) => (
  <Box
    component="nav"
    aria-label="Properties"
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 1.5,
      p: 2,
      textAlign: 'left',
    }}
  >
    {loading
      ? [0, 1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={96} sx={{ borderRadius: 1 }} />)
      : properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            selected={property.id === selectedId}
            href={hrefFor(property.id)}
          />
        ))}
  </Box>
);

export default PropertyPicker;
