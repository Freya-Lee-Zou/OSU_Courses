const sortPoints = require('./src/lib/sortPoints');

test('should sort the points array by ascending X value', () => {
    //arrange 
    const points = [
        { x: 3, y: 5 },
        { x: 1, y: 2 },
        { x: 4, y: 7 },
        { x: 2, y: 3 }
    ];
    const result = [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 5 },
        { x: 4, y: 7 }
    ]
    // Act
    const sortedPoints = sortPoints(points);

    // Assert
    expect(sortedPoints).toEqual(result);
});

test('should fail when the points array is not sorted by ascending X value', () => {
    // Arrange
    const points = [
      { x: 3, y: 5 },
      { x: 1, y: 2 },
      { x: 4, y: 7 },
      { x: 2, y: 3 }
    ];
  
    const expectedResult = [
      { x: 1, y: 2 },
      { x: 3, y: 5 },
      { x: 2, y: 3 },
      { x: 4, y: 7 }
    ];
  
    // Act
    sortPoints(points);
  
    // Assert
    expect(points).not.toEqual(expectedResult);
});