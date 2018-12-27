function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let tempArr = arr.slice()
  for (let i = 0; i < tempArr.length; i++) {
    let j = getRandomInt(0, i)
    let temp = tempArr[i]
    tempArr[i] = tempArr[j]
    tempArr[j] = temp
  }
  return tempArr
}
