const socket = io()

const animationDuration = 1000
const boardWidth = 1260
// const boardWidth = 950

socket.on('updateBoard', data => {
    const { teamNumberChanged, newPoints } = data
    console.log(teamNumberChanged)
    console.log(newPoints)
    updateTeamPoints(teamNumberChanged, newPoints)
})

socket.on('startPoints', () => {
  let data = getPointsObjectFromSpreadsheet()
})

const updateTeamPoints = (teamNumberChanged, newPoints) => {
    // get the icon of the team, move it to match its new points
    const team = document.getElementById('team-' + teamNumberChanged)
    newPosition = (newPoints / 100) * boardWidth
    animateTeam(team, newPosition, animationDuration)
}

const animateTeam = (element, targetPosition, duration = 1500) => {
    const startPosition = parseInt(element.style.left) || 0;
    const startTime = performance.now();
  
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      element.style.left = `${startPosition + progress * (targetPosition - startPosition)}px`;
      if (progress < 1) requestAnimationFrame(animate);
    };
  
    requestAnimationFrame(animate);
  }

const getPointsObjectFromSpreadsheet = async () => {
  let response = await fetch('https://script.google.com/macros/s/AKfycbwXMvliV8BAkYUdAnQqQKTja068Uy2ucD6XsxJXn5r6_84jsJyid4D_BNc4E4tbjXwYpQ/exec')
  let data = await response.json()
  
  let items = Object.keys(data)
  for (let i = 0; i < items.length; i++) {
    let teamNumber = items[i].split(' ')[1]
    let teamPoints = data[items[i]]

    updateTeamPoints(teamNumber, teamPoints)
  }
}