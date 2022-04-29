app.get('/api/employees', (request, response) => {
  response.json(employees);
});

app.get('/api/employees/:id', (request, response) => {
  const { id } = request.params;
  const employee = employees.find((emp) => emp.id === id);
  response.json(employee);
  console.log(employee);
});

app.put('/api/employees/:id', (request, response) => {
  const updatedEmployee = request.body;
  const { id } = request.params;
  let fileData = JSON.parse(fs.readFileSync('./db.json'));

  fileData = fileData.map((employee) => (employee.id === id ? updatedEmployee : employee));

  fsWriteFile(fileName, JSON.stringify(fileData, null, 2));
  response.json(updatedEmployee);
});
