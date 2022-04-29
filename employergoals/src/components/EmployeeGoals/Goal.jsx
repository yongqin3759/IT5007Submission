import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextField from '@mui/material/TextField';
import { ProgressBar, Button } from 'react-bootstrap';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import employeesServices from '../../services/employees'
import { FcApproval } from 'react-icons/fc';
import Step from './Step';
import Error from './Error';
import EmployeeGoalsPage from '../../views/EmployeeGoalsPage';

const Goal = ({ myGoal, auth , handleDeleteGoal}) => {
  const [showResults, setShowResults] = useState(false);
  const [goal,setGoal] = useState(myGoal)
  const [steps, setSteps] = useState([...goal.steps])
  let errorMsg = null;
  let style = {
    fontSize: 'large',
    backgroundColor: 'rgb(240,248,255)',
    padding: 10,
    margin: 5,
    marginBottom: 20,
    width: 800,
    borderRadius: 10,
  };

  let buttonStyle = {
    position: 'absolute',
    right: 10,
    top: 20,
    backgroundColor: 'red',
    borderRadius: '50%',
  }

  let progressBarColor;

  const goalCompletionRate = steps.reduce((prev, current) => (
    prev + ((current.assignedPercentage * current.completedPercentage) / 100)), 0);

  const totalAssignedPercentage = steps.reduce((prev, current) => (
    prev + (current.assignedPercentage)), 0);

  if (goalCompletionRate > 100) {
    progressBarColor = 'danger';
  } else if (goalCompletionRate >= 70) {
    progressBarColor = 'success';
  } else if (goalCompletionRate >= 30) {
    progressBarColor = 'info';
  } else {
    progressBarColor = 'warning';
  }

  if (totalAssignedPercentage > 100) {
    errorMsg = 'Your total Assigned Percentage Exceeds 100%';
    style = {
      ...style,
      backgroundColor: '#FFCCCC',
    };
    progressBarColor = 'danger';
  } else if (totalAssignedPercentage === 100) {
    style = {
      ...style,
      outline: '5px solid #6B8E23',
    };
  }

  const addNewStep = () => {
    let newStep = {};
    if (goalCompletionRate < 100) {
      newStep = {
        assignedPercentage: 100 - totalAssignedPercentage,
        completedPercentage: 0,
        goalId: goal.id,
        name: '',
        percentage: 0,
      };
    } else {
      newStep = {
        assignedPercentage: 0,
        completedPercentage: 0,
        goalId: goal.id,
        name: '',
        percentage: 0,
      };
    }
    setSteps([...steps].concat(newStep))
  };

  const handleChangeStep = (e, param, index) => {
    const reg = /^[0-9]*$/;
    const copiedSteps = [...steps]
    const currentStep = copiedSteps[index];
    let changedVal = e.target.value;
    if (param !== 'name') {
      changedVal = parseInt(e.target.value.match(reg), 10) || 0;
      changedVal = changedVal > 100 ? 100 : changedVal;
      currentStep.percentage = changedVal * ((param === 'assignedPercentage' ? currentStep.completedPercentage : currentStep.assignedPercentage) / 100);
    }
    currentStep[param] = changedVal;
    setSteps(copiedSteps)
  };

  const handleDeleteStep= (index) => {
    setSteps([...steps].filter((_,i) => i !== index))
  }

  const handleSaveChanges = () => {
    employeesServices.update(goal._id, { name: goal.name, steps }, auth.user.token)
                      .then(res => console.log(res))
  }

  
  const handleGoalNameChange = (e) => {
    let goalName = e.target.value
    setGoal({...goal, name: goalName})
  }

  return (
    <div style={style}>
      <TextField
          label={goal.name ? 'Goal' : 'Goal Name?'}
          id='outlined-start-adornment'
          value={goal.name}
          onChange={handleGoalNameChange}
          sx={{ m: 1, width: '25ch' }}
        />
        <button type="button" style={{ float: 'right', borderRadius: '5px', padding: '12px 5px' }} onClick={() => setShowResults(!showResults)}>
          {showResults ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </button>
      <ProgressBar
       variant={progressBarColor}
       style={{ width: 'max-width', height: 40 }}
       max={100}
       now={goalCompletionRate}
       label={`Completed: ${goalCompletionRate}%`}
       />
      { showResults ? (
        <div>
          {
          steps.map((step, index) => (
            <div key={index} style={{position: 'relative'}}>
            <Step
              step={step}
              index={index}
              changeStep={(e, param) => handleChangeStep(e, param, index)} />
            <button style={buttonStyle} onClick={()=>handleDeleteStep(index)}>➖</button>
            </div>
          ))
        }
          <div className="d-grid gap-2">
            <Button onClick={addNewStep} variant="primary" size="m">
              Add New Step
            </Button>
          </div>
        </div>
      ) : null}
      <h6>
        Total Assigned Percentage: {totalAssignedPercentage} %
        {totalAssignedPercentage === 100 ? <FcApproval /> : null}
      </h6>
      <Button variant="success" size="lg" onClick={handleSaveChanges}>Save Changes </Button>
      <Button variant="warning" size="lg" onClick={()=>handleDeleteGoal(goal._id)}>Delete Goal </Button>
      <Error msg={errorMsg} />
      
    </div>
  );
};

export default Goal;
