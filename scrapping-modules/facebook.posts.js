const puppeteer = require("puppeteer");
exports.findPost = url => {
  return new Promise((resolve, reject) => {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      listOfPosts = await page.evaluate(() => {
        let list = Array.from(
          document.querySelectorAll("div._5pcb._4b0l._2q8l a._5pcq"),
          element => (element.className == "_5pcq" ? element.href : "")
        );
        return list;
      });

      await browser.close();

      const error = listOfPosts === undefined || listOfPosts.length == 0;
      if (!error) resolve();
      else reject("Error : WTF dude this champ is tooooo EZ !!!!!!!!");
    })();
  });
};
/*
Array.from(document.querySelectorAll("div._5pcb._4b0l._2q8l a._5pcq"), element=>element.className == "_5pcq"? element.href:"")
*/

findPost()
  .then(() => console.log("OK"))
  .catch(err => console.log("ERR"));
