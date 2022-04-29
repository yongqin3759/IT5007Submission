import React, { useState , useEffect} from 'react';
import Goal from './Goal';
import employeeService from '../../services/employees'

const EmployeeGoals = ({ employee, changeGoal,  auth}) => {
  const [goals, setGoals] = useState([])
  
  useEffect(() => {
    setGoals(employee.goals)
  }, [employee.goals]);

  if (employee === null) {
    return null;
  }
  

  const handleDeleteGoal = (goalId) => {
    employeeService.remove(goalId, auth.user.token)
                .then(res => console.log(res))
    setGoals([...goals].filter(function( goal ) {
      return goal._id !== goalId;
    }))
    console.log(goals)
  }
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <h2>
          Goals for:{' '}
          {employee.fullName}
        </h2>
        { goals.map((goal, id) => (
          <Goal
            key={id}
            myGoal={goal}
            changeGoal= {(e) => changeGoal(e, goal.id)}
            auth={auth}
            handleDeleteGoal={(goalId)=> handleDeleteGoal(goalId)}
          />
        ))}

      </div>

    </div>
  );
};

export default EmployeeGoals;
