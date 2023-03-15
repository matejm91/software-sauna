import followPath from "../findPath"

// #### A basic example

const map1 = `
  @---A---+
          |
  x-B-+   C
      |   |
      +---+
`

// Expected result: 
// - Letters ```ACB```
// - Path as characters ```@---A---+|C|+---+|+-B-x```

// #### Go straight through intersections

const map2 = `
  @
  | +-C--+
  A |    |
  +---B--+
    |      x
    |      |
    +---D--+
`

// Expected result: 
// - Letters ```ABCD```
// - Path as characters ```@|A+---B--+|+--C-+|-||+---D--+|x```

// #### Letters may be found on turns

const map3 = `
  @---A---+
          |
  x-B-+   |
      |   |
      +---C
`

// Expected result: 
// - Letters ```ACB```
// - Path as characters ```@---A---+|||C---+|+-B-x```

// #### Do not collect a letter from the same location twice

const map4 = `
     +-O-N-+
     |     |
     |   +-I-+
 @-G-O-+ | | |
     | | +-+ E
     +-+     S
             |
             x
`

// Expected result: 
// - Letters ```GOONIES```
// - Path as characters ```@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x```

// #### Keep direction, even in a compact space

const map5 = `
 +-L-+
 |  +A-+
@B+ ++ H
 ++    x
`

// Expected result: 
// - Letters ```BLAH```
// - Path as characters ```@B+++B|+-L-+A+++A-+Hx```

// #### Ignore stuff after end of path

const map6 = `
  @-A--+
       |
       +-B--x-C--D
`

// Expected result: 
// - Letters ```AB```
// - Path as characters ```@-A--+|+-B--x```

// ### Invalid maps

// #### Missing start character

const map7 = `
     -A---+
          |
  x-B-+   C
      |   |
      +---+
`

// Expected result: Error

// #### Missing end character

const map8 = `
   @--A---+
          |
    B-+   C
      |   |
      +---+
`

// Expected result: Error

// #### Multiple starts

const map9 = `
   @--A-@-+
          |
  x-B-+   C
      |   |
      +---+
`

const map10 = `
   @--A---+
          |
          C
          x
      @-B-+
`

const map11 = `
   @--A--x

  x-B-+
      |
      @
`

// Expected result: Error

// #### Fork in path

const map12 = `
        x-B
          |
   @--A---+
          |
     x+   C
      |   |
      +---+
`

// Expected result: Error

// #### Broken path

const map13 = `
   @--A-+
        |
         
        B-x
`

// Expected result: Error

// #### Multiple starting paths

const map14 = `
  x-B-@-A-x
`

// Expected result: Error

// #### Fake turn

const map15 = `
  @-A-+-B-x
`

// Expected result: Error

// vertical fake turn
const map16 = `
  @
  |
  A
  |
  +
  |
  B
  |
  x
`

test("testing map 1", () => {
  const resultMap1 = followPath(map1);
  expect(resultMap1).toStrictEqual({letters: 'ACB', pathData: '@---A---+|C|+---+|+-B-x'})
})

test("testing map 2", () => {
  const resultMap2 = followPath(map2);
  expect(resultMap2).toStrictEqual({letters: 'ABCD', pathData: '@|A+---B--+|+--C-+|-||+---D--+|x'})
})

test("testing map 3", () => {
  const resultMap3 = followPath(map3);
  expect(resultMap3).toStrictEqual({letters: 'ACB', pathData: '@---A---+|||C---+|+-B-x'})
})

test("testing map 4", () => {
  const resultMap4 = followPath(map4);
  expect(resultMap4).toStrictEqual({letters: 'GOONIES', pathData: '@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x'})
})

test("testing map 5", () => {
  const resultMap5 = followPath(map5);
  expect(resultMap5).toStrictEqual({letters: 'BLAH', pathData: '@B+++B|+-L-+A+++A-+Hx'})
})

test("testing map 6", () => {
  const resultMap6 = followPath(map6);
  expect(resultMap6).toStrictEqual({letters: 'AB', pathData: '@-A--+|+-B--x'})
})

test("testing map 7", () => {
  const resultMap7 = followPath(map7);
  const errorMsg = 'Missing start character'
  expect(resultMap7).toStrictEqual({ error: errorMsg, steps: 0 })
})

test("testing map 8", () => {
  const resultMap8 = followPath(map8);
  const errorMsg = 'Missing end character'
  expect(resultMap8).toStrictEqual({ error: errorMsg, steps: 1 })
})

test("testing map 9", () => {
  const resultMap9 = followPath(map9);
  const errorMsg = 'Multiple starting points'
  expect(resultMap9).toStrictEqual({ error: errorMsg, steps: 1 })
})

test("testing map 10", () => {
  const resultMap10 = followPath(map10);
  const errorMsg = 'Multiple starting points'
  expect(resultMap10).toStrictEqual({ error: errorMsg, steps: 1 })
})

test("testing map 11", () => {
  const resultMap11 = followPath(map11);
  const errorMsg = 'Multiple starting points'
  expect(resultMap11).toStrictEqual({ error: errorMsg, steps: 1 })
})

test("testing map 12", () => {
  const resultMap12 = followPath(map12);
  const errorMsg = 'Fork in path'
  expect(resultMap12).toStrictEqual({ error: errorMsg, steps: 8 })
})

test("testing map 13", () => {
  const resultMap13 = followPath(map13);
  const errorMsg = 'Broken path'
  expect(resultMap13).toStrictEqual({ error: errorMsg, steps: 8 })
})

test("testing map 14", () => {
  const resultMap14 = followPath(map14);
  const errorMsg = 'Multiple starting paths'
  expect(resultMap14).toStrictEqual({ error: errorMsg, steps: 1 })
})

test("testing map 15", () => {
  const resultMap15 = followPath(map15);
  const errorMsg = 'Fake turn'
  expect(resultMap15).toStrictEqual({ error: errorMsg, steps: 5 })
})

test("testing map 6", () => {
  const resultMap6 = followPath(map16);
  const errorMsg = 'Fake turn'
  expect(resultMap6).toStrictEqual({ error: errorMsg, steps: 5 })
})