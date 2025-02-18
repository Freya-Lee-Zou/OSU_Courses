require("whatwg-fetch")

// Fake a restful api
const rest = require("msw").rest
const setupServer = require("msw/node").setupServer
const fs = require('fs')

const generateChartImg = require('./src/lib/generateChartImg');

const server = setupServer(
    rest.post("https://quickchart.io/chart", (req, res, ctx) => {
        
        // Check MSW call
        console.log("==Fake API called")  
    
        // Read the PNG image file to use as the fake response
        const chartImage = fs.readFileSync("./src/generateChartImg.png")
    
        // Return the PNG image as the response body
        return res(
            ctx.set("Content-Type", "image/png"),
            ctx.body(chartImage)
        )
    })
)

beforeAll(function () {
    server.listen()
})

afterAll(function () {
    server.close()
})

test("generateChartImg should return valid chart", async () => {
    // Define the input parameters for the generateChartImg function
    const type = "line"
    const data = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ];
    const xLabel = "X Axis"
    const yLabel = "Y Axis"
    const title = "Chart Title"
    const color = "#FF4500"
    
    // Generate the chart image
    const generatedImg = await generateChartImg(type, data, xLabel, yLabel, title, color)

    // Verify the generated image is a non-empty string
    expect(typeof generatedImg).toBe("string")
    expect(generatedImg.length).toBeGreaterThan(0)
})