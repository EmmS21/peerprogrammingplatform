// /**
//  * Dependency Modules
//  */

// var assert = require("assert").strict;
// var webdriver = require("selenium-webdriver");
// const path = require("chromedriver");
// const { AssertionError } = require("assert");
// const { By, until, Keys } = webdriver;
// require("geckodriver");
// // Application Server
// const serverUri = "http://localhost:3000/#";
// const appTitle = "Pair Programming Platform";
// const chai = require("chai");
// const chaiAsPromised = require("chai-as-promised");
// const { resolveObjectURL } = require("buffer");

// chai.use(chaiAsPromised);

// /**
//  * Config for Chrome browser
//  * @type {webdriver}
//  */
// var browser = new webdriver.Builder()
//   .usingServer()
//   .withCapabilities({ browserName: "chrome" })
//   .build();
// /**
//  * Config for Firefox browser (Comment Chrome config when you intent to test in Firefox)
//  * @type {webdriver}
//  */
// /*
//  var browser = new webdriver.Builder()
//   .usingServer()
//   .withCapabilities({ browserName: "firefox" })
//   .build();
//   */
// /**
//  * Function to get the title and resolve it it promise.
//  * @return {[type]} [description]
//  */
// const expect = chai.expect;

// function logTitle() {
//   return new Promise((resolve, reject) => {
//     browser.getTitle().then(function (title) {
//       resolve(title);
//     });
//   });
// }

// describe("Home Page", function () {
//   it("Load the home page and get title", function () {
//     return new Promise((resolve, reject) => {
//       browser
//         .get(serverUri)
//         .then(logTitle)
//         .then((title) => {
//           assert.strictEqual(title, appTitle);
//           resolve();
//         })
//         .catch((err) => reject(err));
//     });
//   });
//   it("Get Started button loads", function () {
//     return new Promise((resolve, reject) => {
//       browser
//         .findElement({ id: "get-started" })
//         .then((elem) => resolve())
//         .catch((err) => reject(err));
//     });
//   });
//   it("login page renders upon clicking login", function () {
//     return new Promise((resolve, reject) => {
//       browser
//         .findElement({ id: "login" })
//         .click()
//         .then(() => {
//           browser.getCurrentUrl().then((url) => {
//             expect(url).equals("http://localhost:3000/login");
//             resolve();
//           });
//         });
//     });
//   });
//   it("login button enabled when all fields populated", function () {
//     return new Promise((resolve, reject) => {
//       browser.findElement({ id: "name-field" }).sendKeys("emmanuelS21");
//       browser.findElement({ id: "password-field" }).sendKeys("K@leidoscope69");
//       browser.findElement({ id: "login-button" }).click();

//       // browser.wait(until.elementLocated(By.id("login-button"))).isEnabled()
//       // .then((resp) => {
//       //   expect(resp).equal(true)
//       //   resolve()
//       // })
//     });
//   });
//   // it("authenticates user and redirects them to profile page", function() {
//   //   return new Promise((resolve, reject) => {
//   //     browser.findElement({ id: "login-button"})
//   //     .click()
//   //     .then(() =>{
//   //       browser
//   //       .getCurrentUrl()
//   //       .then((url) => {
//   //         expect(url).equals("http://localhost:3000/")
//   //         resolve()
//   //       })
//   //     })
//   //   })
//   // })
//   after(function () {
//     browser.quit();
//   });
// });
