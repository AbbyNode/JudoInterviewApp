fetch('http://localhost:8000/event', {
  method: 'POST',
  body: JSON.stringify({ "experienceID": 1 }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log);
