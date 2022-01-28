/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Abhishek Singh",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Gunjan Arora",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Tim Bidawat",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Vishnu Sharma",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions
let activeAccount;
let sorted = false;

// DIsplay All the transactions------------------------------------
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  // Sorting movements
  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // ---------------------------
  movs.forEach(function (movement, i) {
    let type = movement > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
    <div class="movements__value">${movement}Rs</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Calculate and display balance of account-----------------------
const calcAndDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}Rs.`;
};

// User name creation -----------------------------------------------
const creatUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
creatUserName(accounts);

// Display all the summary about total deposite total withdrawal or intrest---------

const calcSummary = function (account) {
  // console.log(activeAccount);
  const deposit = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${deposit}Rs.`;
  const out = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}Rs.`;
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * account.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}Rs.`;
};

// update UI ------------------------------------------------------------

const updateUI = function () {
  displayMovements(activeAccount.movements);
  calcAndDisplayBalance(activeAccount);
  calcSummary(activeAccount);
  // sorting(activeAccount.movements);
  // console.log(activeAccount);
};

/////////////////////////
// Event Handllers********************************************************

// Login process**************************************************************************
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  activeAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  // console.log(activeAccount);
  if (activeAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = "100";
    labelWelcome.textContent = `Welcome ${activeAccount.owner.split(" ")[0]}`;
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    updateUI();
  }
});

// Transfer amount ************************************************************************

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let recieverAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    recieverAccount &&
    amount <= activeAccount.balance &&
    recieverAccount.userName !== activeAccount.userName
  ) {
    recieverAccount.movements.push(amount);
    activeAccount.movements.push(-amount);
    updateUI();
  }
});

// Closing an account---------------------------------------------

// btnClose.addEventListener("click", function (e) {
//   e.preventDefault();
//   if (
//     activeAccount.userName === inputCloseUsername.value &&
//     activeAccount.pin === Number(inputClosePin.value)
//   ) {
//     const index = accounts.findIndex((acc) => {
//       acc.userName === activeAccount.userName;
//       // console.log(acc.userName, activeAccount.userName);
//     });

//     // accounts.splice(index, 1);
//     console.log(index);
//   }
//   containerApp.style.opacity = "0";
//   inputCloseUsername.value = inputClosePin.value = "";
// });
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === activeAccount.userName &&
    Number(inputClosePin.value) === activeAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === activeAccount.userName
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

// Impimenting loan button----------------------------------------

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && activeAccount.movements.some((mov) => amount * 0.1)) {
    activeAccount.movements.push(amount);
    updateUI();
  }
  inputLoanAmount.value = "";
});

// Implimentng sort button----------------------------------------------

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(activeAccount.movements, !sorted);
  sorted = !sorted;
});
