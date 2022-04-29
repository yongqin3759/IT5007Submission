import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

const Step = ({ step, changeStep }) => (
    <div style={{ padding: 3, fontSize: '30px' }}>

      <TextField
          label= {step.name ? 'Step Name' : 'Step Name?'}
          id="outlined-start-adornment"
          value={step.name}
          onChange={(e) => changeStep(e, 'name')}
          sx={{ m: 1, width: '25ch' }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      <TextField
          label="Assigned"
          id="outlined-start-adornment"
          value={step.assignedPercentage}
          onChange={(e) => changeStep(e, 'assignedPercentage')}
          sx={{ m: 1, width: '7ch' }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      <TextField
          label="Done"
          id="outlined-start-adornment"
          value={step.completedPercentage}
          onChange={(e) => changeStep(e, 'completedPercentage')}
          sx={{ m: 1, width: '7ch' }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}/>
    </div>
);

export default Step;
