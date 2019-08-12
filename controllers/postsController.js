const fs = require("fs");
const puppeteer = require("puppeteer");
let keyWords = [];
// scroll infinit items
// post text : Array.from(document.querySelectorAll("div._5pbx.userContent._3576 p"),element => element.textContent)
let validTag = (keys, tag) => {
  for (var i = 0; i < keys.length; i++) if (tag.includes(keys[i])) return true;
  return false;
};
let extractItems = () => {
  let list = Array.from(
    document.querySelectorAll("div._5pcb._4b0l._2q8l "),
    function(element) {
      var res = {};

      res.link = element.querySelector("a._5pcq").href;
      if (element.querySelector("p") != null)
        res.tag = element.querySelector("p").textContent;
      else res.tag = "";
      res.img = "";
      if (element.querySelector("._4-eo._2t9n._50z9 img") != null)
        res.img = element.querySelector("._4-eo._2t9n._50z9 img").src;
      if (element.querySelector("._3x-2 img") != null)
        res.img = element.querySelector("._3x-2 img").src;
      return res;
    }
  );

  return list.filter(element => element.tag != "");
};

let scrapeInfiniteScrollItems = async (
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000
) => {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(scrollDelay);
    }
  } catch (e) {}
  return items;
};

// connxion FB
let connectToFacebook = async (page, email, password) => {
  const sleep = async ms => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, ms);
    });
  };
  const ID = {
    login: "#email",
    pass: "#pass"
  };
  await page.goto("https://facebook.com", {
    waitUntil: "networkidle2"
  });
  await page.waitForSelector(ID.login);
  console.log("loggin in ...");
  await page.type(ID.login, email);

  await page.type(ID.pass, password);
  await sleep(500);

  await page.click("#loginbutton");

  console.log("login done");
};

let listOfPosts = [];
function findPost(url, numberOfPosts = 0, email, password) {
  return new Promise((resolve, reject) => {
    (async () => {
      const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      const page = await browser.newPage();
      page.setViewport({ width: 1280, height: 926 });
      await connectToFacebook(page, email, password);
      console.log("open profile..");
      await page.goto(url);
      console.log("scrapping Posts...");
      listOfPosts = await scrapeInfiniteScrollItems(
        page,
        extractItems,
        numberOfPosts,
        2000 //scroll delays
      );
      await browser.close();
      const error = listOfPosts === undefined || listOfPosts.length == 0;
      if (!error) resolve();
      else reject("Sorry somthing happend. can't find any post.");
    })();
  });
}

exports.getAllPosts = (req, res) => {
  console.log(req.body);
  keyWords = req.body.keyWords.split(" ");
  var numberOfPosts = parseInt(req.body.numberOfPosts);
  var email = req.body.email;
  var password = req.body.password;
 

  findPost(req.body.accountUrl, numberOfPosts, email, password)
    .then(() =>{
      res.json({
        status: true,
        message: "list of Posts",
        posts: listOfPosts.filter(element => validTag(keyWords, element.tag))
      })
      console.log("sending result");
    }
      
    )
    .catch(err =>
      res.json({
        status: false,
        message: err,
        posts: listOfPosts
      })
    );
};