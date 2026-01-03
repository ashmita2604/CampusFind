function showSignIn() {
  document.getElementById("signUpForm").classList.add("hidden");
  document.getElementById("signInForm").classList.remove("hidden");
}

function showSignUp() {
  document.getElementById("signInForm").classList.add("hidden");
  document.getElementById("signUpForm").classList.remove("hidden");
}

function togglePassword(inputId, element) {
  const input = document.getElementById(inputId);
  const icon = element.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  }
}



