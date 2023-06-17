import { stands } from '../src/data/stands'

describe('Stand location', () => {
  stands.forEach((stand, index) => {
    test(`Stand ${index + 1} - ${stand.name} has valid positions`, () => {
      expect(stand.topLeftPosition.x).toBeLessThanOrEqual(
        stand.bottomRightPosition.x
      )
      expect(stand.topLeftPosition.y).toBeLessThanOrEqual(
        stand.bottomRightPosition.y
      )
    })
  })
})

describe('Stands map id', () => {
  stands.forEach((stand, index) => {
    test(`Stand ${index + 1} - ${stand.name} has a valid friendlyMapId (${stand.friendlyMapId})`, () => {
      expect(['Codecon 2023 - 2', 'Codecon 2023']).toContain(stand.friendlyMapId)
    })
  })
})
