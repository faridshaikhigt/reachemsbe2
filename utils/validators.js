export const validateName = (name) => {
    const regexName = new RegExp(/[a-zA-Z][a-zA-Z]+[a-zA-Z]$/)
    return regexName.test(name);
}

export const validateEmail = (email) => {
    const regexName = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );
    return regexName.test(email);
}

export const validatePassword = (pass) => {
  const regexName = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);
  return regexName.test(pass);
};


export const validateRole = (role) => {
    return role==="admin" || role==="company"
}