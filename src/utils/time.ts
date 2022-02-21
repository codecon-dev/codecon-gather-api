export function getTimeInMinutesSince(dateInMiliseconds: number) {
  const now = Date.now()
  return (now - dateInMiliseconds) / (1000 * 60)
}

export async function wait(timeInMiliseconds: number) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, timeInMiliseconds);
  });
}