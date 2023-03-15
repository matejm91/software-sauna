function findError(map: string, rows: string[], steps: number, x: number, y: number, height: number, currentChar: string, stepX: number, stepY: number) {
  let firstCharMatches: RegExpMatchArray | null = map.match(/@/g);
  let endCharMatches: RegExpMatchArray | null = map.match(/x/g);

  if (currentChar.trim() === '') {
    return { error: 'Broken path', steps };
  }

  if (firstCharMatches && firstCharMatches?.length > 1) {
    return { error: "Multiple starting points", steps };
  }

  if (!endCharMatches || endCharMatches?.length < 1) {
    return { error: "Missing end character", steps };
  }

  if (x >= 0 && y >= 0 && steps === 1) {
    let surroundingChars: string[] = []
    if (rows[y + 1] && rows[y + 1][x] && rows[y + 1][x].trim() !== '') {
      surroundingChars.push(rows[y + 1][x])
    }

    if (rows[y - 1] && rows[y - 1][x] && rows[y - 1][x].trim() !== '') {
      surroundingChars.push(rows[y - 1][x])
    }

    if (rows[y][x + 1] && rows[y][x + 1].trim() !== '') {
      surroundingChars.push(rows[y][x + 1])
    }

    if (rows[y][x - 1] && rows[y][x - 1].trim() !== '') {
      surroundingChars.push(rows[y][x - 1])
    }

    if (surroundingChars.length > 1) {
      return { error: "Multiple starting paths", steps };
    }
  }

  if (currentChar === '+') {
    if (stepX !== 0) {
      if (rows[y + 1] && rows[y + 1][x] === '|' && rows[y - 1] && rows[y - 1][x] === '|') {
        return { error: "Fork in path", steps };
      }

      if ((rows[y + 1] && rows[y + 1][x] === '|' && rows[y - 1] && rows[y - 1][x] === '|') || (rows[y] && rows[y][x + stepX] === '-')) {
        return { error: "Fake turn", steps };
      }
    }

    if (stepY !== 0) {
      if ((rows[y][x + 1] === '-' && rows[y][x - 1] === '-') || (rows[y + stepY] && rows[y + stepY][x] === '|')) {
        return { error: "Fake turn", steps };
      }
    }

  }

  // I messed up error
  if (y > height - 1 || x > rows[y].length - 1) {
    return { error: 'I (programmer) did a bad thing and currentChar is looked for outside of the matrix scope :/', steps }
  }

  return false;
}

export default function followPath(map: string) {
  const rows: string[] = map.split('\n')//.filter(row => row.trim() !== "");
  const width: number = rows[0].length;
  const height: number = rows.length;
  let verticalMove: number = 0;
  let horizontalMove: number = 0;
  let x: number = 0;
  let y: number = 0;
  let stepX: number = 0;
  let stepY: number = 0;
  let letters: string = '';
  let steps: number = 0;
  let pathData: { x: number, y: number, currentChar: string }[] = [];

  if (!rows[rows.findIndex(row => row.includes('@'))]) {
    return { error: "Missing start character", steps };
  }

  x = rows[rows.findIndex(row => row.includes('@'))].indexOf('@');
  y = rows.findIndex(row => row.includes('@'));

  while (true) {
    x += stepX;
    y += stepY;
    steps++;

    const currentChar: string = rows[y][x];

    // Errors
    if (findError(map, rows, steps, x, y, height, currentChar, stepX, stepY)) {
      return findError(map, rows, steps, x, y, height, currentChar, stepX, stepY)
    }

    // Return statement

    if ((x >= width && y >= height) || currentChar === 'x') {
      // End of map
      // console.log('-------------- got hit here -------------------')
      pathData.push({ x, y, currentChar })
      return { letters, pathData: pathData.map(pathInstance => pathInstance.currentChar).join('') };
    }

    // Logic

    if (currentChar === '@') {
      // pathData.push({ x, y, currentChar })
      if (rows[y].trim() === '@') {
        verticalMove = 1;
      } else {
        horizontalMove = 1;
      }
    }

    if (currentChar === '+') {
      // Intersection, change direction
      if (stepX !== 0) {
        verticalMove = rows[y - 1] !== undefined ?
          (rows[y - 1][x] && (rows[y - 1][x] === '|' || rows[y - 1][x] === '+' || rows[y - 1][x].match(/[A-Z]/)) ?
            -1 :
            1) :
          1;
        horizontalMove = 0;

      }
      if (stepY !== 0) {
        horizontalMove = (rows[y][x - 1] === '-' || rows[y][x - 1] === '+' ? -1 : 1);
        verticalMove = 0;
      }
    }

    if (currentChar.match(/[A-Z]/)) {
      // Collect letter
      if (pathData.find(pathInstance => pathInstance.x === x && pathInstance.y === y && pathInstance.currentChar === currentChar) === undefined) {
        letters += currentChar;

        if (stepX !== 0) {
          horizontalMove = rows[y][x + stepX].match(/[A-Za-z]/) || rows[y][x + stepX] === '-' || rows[y][x + horizontalMove] === '+' ? 1 : 0
          if (stepX <= 0) {
            horizontalMove *= -1
          }

          if (horizontalMove !== 0) {
            verticalMove = 0;
          } else {
            horizontalMove = 0;
          }
        }

        if (stepY !== 0) {
          horizontalMove = (rows[y][x - 1] === '-' || rows[y][x - 1] === '+' || rows[y][x - 1].match(/[A-Za-z]/) ?
            -1 :
            (rows[y][x + 1] && (rows[y][x + 1] === '-' || rows[y][x + 1] === '+' || rows[y][x + 1].match(/[A-Za-z]/))) ?
              1 :
              0);

          verticalMove = rows[y + stepY] && (rows[y + stepY][x].match(/[A-Za-z]/) || rows[y + stepY][x] === '|' || rows[y + verticalMove][x] === '+') ? 1 : 0
          if (stepY <= 0) {
            verticalMove *= -1
          }

          if (verticalMove !== 0) {
            horizontalMove = 0;
          } else {
            verticalMove = 0;
          }
        }

      }
    }

    // Move in current direction
    stepX = horizontalMove;
    stepY = verticalMove;

    pathData.push({ x, y, currentChar })
    // console.log('----------------------------------------------------------', letters, '--------------------', pathData)
  }
}