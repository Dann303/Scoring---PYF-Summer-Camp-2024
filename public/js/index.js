const socket = io()

const animationDuration = 1000
let boardWidth = document.getElementById('lanes').clientWidth - 38

// Variables
$teamPoints = [
  document.getElementById('team-1-points'),
  document.getElementById('team-2-points'),
  document.getElementById('team-3-points'),
  document.getElementById('team-4-points'),
  document.getElementById('team-5-points'),
  document.getElementById('team-6-points')
]

socket.on('updateBoard', data => {
  const { teamNumberChanged, newPoints } = data
  updateTeamPoints(teamNumberChanged, newPoints)
})

socket.on('startPoints', () => {
  let data = getPointsObjectFromSpreadsheet()
})

const updateTeamPoints = (teamNumberChanged, newPoints) => {
  // update the score on the scoreboard (left sidebar)
  $teamPoints[teamNumberChanged - 1].textContent = newPoints

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

const calculateWidth = () => {
  const viewportWidth = window.outerWidth
  let offset = 38
  if (viewportWidth <= 800) {
    offset = 28
  }

  const trackField = document.getElementById('lanes').clientWidth - offset
  boardWidth = trackField
}

const calculateHTMLFontSize = () => {
  const viewportWidth = window.outerWidth
  console.log(viewportWidth)
  let calculatedFontSize
  if (viewportWidth <= 600) {
    calculatedFontSize = 4 + 3 * (viewportWidth / 200)
  } else if (viewportWidth <= 900) {
    calculatedFontSize = 4 + 2.5 * (viewportWidth / 200)
  } else if (viewportWidth <= 1200) {
    calculatedFontSize = 4 + 2 * (viewportWidth / 200)
  }
  if (calculatedFontSize) {
    document.documentElement.style.fontSize = calculatedFontSize + 'px';
  }
}

calculateHTMLFontSize()
calculateWidth()

addEventListener('resize', () => {
  calculateHTMLFontSize()
  calculateWidth()
})