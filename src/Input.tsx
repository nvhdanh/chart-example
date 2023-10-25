import {
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

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
]

type InputProps = {
  state: {
    dataLength: number
    tolerance: number
  }
  setState: React.Dispatch<
    React.SetStateAction<{
      dataLength: number
      tolerance: number
    }>
  >
}

const Input = ({ setState, state }: InputProps) => {
  return (
    <Stack direction={'row'} alignItems={'flex-start'} columnGap={5}>
      <Stack direction={'row'} alignItems={'center'} columnGap={2}>
        <Typography>Data Points:</Typography>
        <Select
          size="small"
          value={state.dataLength}
          onChange={(e) => {
            setState((state) => ({ ...state, dataLength: +e.target.value }))
          }}
        >
          {dataPointItems.map((item) => (
            <MenuItem key={item} value={+item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack direction={'row'} alignItems={'center'} columnGap={2}>
        <Typography>Tolerance:</Typography>
        <TextField
          size="small"
          value={state.tolerance}
          type="number"
          inputProps={{ min: 0, step: 0.2 }}
          onChange={(e) => {
            setState((state) => ({ ...state, tolerance: +e.target.value }))
          }}
        />
        <Slider
          value={state.tolerance}
          step={0.2}
          max={50}
          onChange={(_, newValue) => {
            setState((state) => ({
              ...state,
              tolerance: +newValue,
            }))
          }}
        />
      </Stack>
    </Stack>
  )
}

export default Input
