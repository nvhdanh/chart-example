import { MenuItem, Select, Stack, Typography } from '@mui/material'

const dataPointItems = [
  100,
  500,
  1 * 1000,
  5 * 1000,
  10 * 1000,
  20 * 1000,
  30 * 1000,
  50 * 1000,
  70 * 1000,
  100 * 1000,
  300 * 1000,
  600 * 1000,
]

type InputProps = {
  dataLength: number
  setDataLength: React.Dispatch<React.SetStateAction<number>>
}

const Input = ({ dataLength, setDataLength }: InputProps) => {
  return (
    <Stack direction={'row'} alignItems={'flex-start'} columnGap={5}>
      <Stack direction={'row'} alignItems={'center'} columnGap={2}>
        <Typography>Data Points:</Typography>
        <Select
          size="small"
          value={dataLength}
          onChange={(e) => setDataLength(+e.target.value)}
        >
          {dataPointItems.map((item) => (
            <MenuItem key={item} value={+item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  )
}

export default Input
