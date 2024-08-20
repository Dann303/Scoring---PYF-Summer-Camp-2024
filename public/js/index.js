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
