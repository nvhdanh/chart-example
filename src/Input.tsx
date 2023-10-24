import { MenuItem, Select, Stack, TextField, Typography } from '@mui/material'

const selectItem = [100, 500, 1000, 5000, 10000]

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
    <Stack direction={'row'} alignItems={'center'} columnGap={5}>
      <Stack direction={'row'} alignItems={'center'} columnGap={2}>
        <Typography>Data Points:</Typography>
        <Select
          size="small"
          value={state.dataLength}
          onChange={(e) => {
            setState((state) => ({ ...state, dataLength: +e.target.value }))
          }}
        >
          {selectItem.map((item) => (
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
          inputProps={{ min: 0, step: 0.1 }}
          onChange={(e) => {
            setState((state) => ({ ...state, tolerance: +e.target.value }))
          }}
        />
      </Stack>
    </Stack>
  )
}

export default Input
