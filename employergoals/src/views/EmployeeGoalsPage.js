import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

import employeeService from '../services/employees';
import EmployeeGoals from '../components/EmployeeGoals/EmployeeGoals';
import withAuth from '../hoc/withAuth';
import Navbar from '../components/navbar/NavBar';

const EmployeeGoalsPage = (props) => {
  const [employee, setEmployee] = useState({ ...props.auth.user, goals: [] });

  useEffect(() => {
    employeeService
      .getAll(props.auth.user.token)
      .then(res => {
        setEmployee({ ...employee, goals: res })
      } )
      .catch(err => console.log(err))
  }, []);



  const handleCreateNewGoal = e => {
      e.preventDefault()
      const newGoal = {
        name: 'New Goal',
        steps: [
          {
            assignedPercentage: 20,
            completedPercentage: 50,
            name: '',
            percentage: 10,
          },
        ],
      };
      employeeService.create(newGoal, props.auth.user.token)
          .then(res => {
            let newGoals = [...employee.goals]
            newGoals.push(res)
            setEmployee({...employee, goals: newGoals})
          })
          .catch(err => console.log(err))
  }


  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <h1>My Goals</h1>
          <div style={{
            border: '3px solid #000000', borderRadius: 10, padding: 0, marginBottom: 30,
          }}
          >
            <EmployeeGoals
              employee={employee}
              auth={props.auth}
              
            />
            <div style={{ display: 'flex' }}>
              <div>
                <div style={{ width: 800, margin: 'auto' }} className="d-grid gap-2">
                  <Button onClick={handleCreateNewGoal} variant="dark" size="m">
                    Add New Goal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default withAuth(EmployeeGoalsPage);
