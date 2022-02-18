export async function wait(timeInMiliseconds: number) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, timeInMiliseconds);
  });
}