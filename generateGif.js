    const puppeteer = require("puppeteer");
    const GIFEncoder = require("gif-encoder");
    const encoder = new GIFEncoder(500, 600);
    const fs = require("fs");
    
   async function generateGif(text){
 
    const getPixels = require("get-pixels");
    const workDir = "./temp/";
    let file = require("fs").createWriteStream("./public/output/googleit.gif");
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir);
    }

    encoder.setFrameRate(60);
    encoder.pipe(file);
    encoder.setQuality(40);
    encoder.setDelay(500);
    encoder.writeHeader();
    encoder.setRepeat(0);
  
    function addToGif(images, counter = 0) {
      getPixels(images[counter], function (err, pixels) {
        encoder.addFrame(pixels.data);
        encoder.read();
        if (counter === images.length - 1) {
          encoder.finish();
          cleanUp(images, function (err) {
            if (err) {
              console.log(err);
            } else {
              fs.rmdirSync(workDir);
              console.log("Gif Generated!");
              
            }
          });
        } else {
          addToGif(images, ++counter);
        }
      });
    }
  
    function cleanUp(listOfPNGs, callback) {
      let i = listOfPNGs.length;
      listOfPNGs.forEach(function (filepath) {
        fs.unlink(filepath, function (err) {
          i--;
          if (err) {
            callback(err);
            return;
          } else if (i <= 0) {
            callback(null);
          }
        });
      });
    }
 
    await page.setViewport({ width: 500, height: 600 });
    await page.goto("https://google.com");
    await page.click("[name=q]");

    let contentText = Array.from(text);
    let contentLenght = contentText.length;
    for (let i = 0; i < contentLenght; i++) {
      await page.screenshot({ path: workDir + i + ".png" });
      await page.keyboard.type(contentText[i]);
    }
  
    await browser.close();
  
    let listOfPNGs = fs
      .readdirSync(workDir)
      .map((a) => a.substr(0, a.length - 4) + "")
      .sort(function (a, b) {
        return a - b;
      })
      .map((a) => workDir + a.substr(0, a.length) + ".png");
  
    addToGif(listOfPNGs);
}

module.exports = generateGif;