import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validators.js";

describe("validateEmail", () => {
  test("guest@email.com is valid", () => {
    expect(validateEmail("guest@email.com")).toBe(true);
  });
  test("guest@email is invalid", () => {
    expect(validateEmail("guest@email")).toBeFalsy();
  });
  test("guest@email. is invalid", () => {
    expect(validateEmail("guest@email.")).toBeFalsy();
  });
  test("guest@.com is invalid", () => {
    expect(validateEmail("guest@.com")).toBeFalsy();
  });
  test("@email.com is invalid", () => {
    expect(validateEmail("@email.com")).toBeFalsy();
  });
});

describe("validateName", () => {
  test("Guest is valid", () => {
    expect(validateName("Guest")).toBe(true);
  });
  test("'Loren' Brein' is valid", () => {
    expect(validateName("Loren' Brein")).toBe(true);
  });
  test("guest@email. is invalid", () => {
    expect(validateName("guest@email.")).toBeFalsy();
  });
});

describe("validatePassword", () => {
  test("'abcde' is invalid" , ()=>{
    expect(validatePassword('abcde')).toBeFalsy()
  })
  test("'abcde1' is invalid" , ()=>{
    expect(validatePassword('abcde1')).toBeFalsy()
  })
  test("'abcd@1' is invalid" , ()=>{
    expect(validatePassword('abd@1')).toBeFalsy()
  })
  test("'Adtre@1' is valid" , ()=>{
    expect(validatePassword('Adtre@1')).toBe(true)
  })
  test("'ABCDER@1223' is invalid" , ()=>{
    expect(validatePassword('ABCDER@1223')).toBeFalsy()
  })
  test("'123451' is invalid" , ()=>{
    expect(validatePassword('123451')).toBeFalsy()
  })
  test("'1234@11' is invalid" , ()=>{
    expect(validatePassword('1234@11')).toBeFalsy()
  })
  test("'@!@$#^!*' is invalid" , ()=>{
    expect(validatePassword('@!@$#^!*')).toBeFalsy()
  })

});
