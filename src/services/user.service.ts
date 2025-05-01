import type testService from "./test.service";

export default class userService {
  constructor(testService: testService) {}

  getUser() {
    return console.log("goi tao lam cai loz gi");
  }
}
