console.log("hello");

let N = 12;
let inputValue = "";
let stack1 = [];
let encryptedValues = [];
let decryptedStack = [];

const keys = generateRSAKeys();
const publicKey = keys.publicKey;
const privateKey = keys.privateKey;

// Генерація ключів RSA
function generateRSAKeys() {
    const p = generatePrimeNumber();
    const q = generatePrimeNumber();
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const e = generatePublicKey(phi);
    const d = generatePrivateKey(e, phi);

    return { publicKey: { e, n }, privateKey: { d, n } };
}

// Генерація випадкового простого числа
function generatePrimeNumber() {
    function isPrime(num) {
        for (let i = 2; i < num; i++)
            if (num % i === 0) return false;
        return num !== 1;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let randomNum = getRandomInt(2, 100);
    while (!isPrime(randomNum)) {
        randomNum = getRandomInt(2, 100);
    }

    return randomNum;
}

// Розширений алгоритм Евкліда для знаходження оберненого модулю
function extendedEuclidean(a, b) {
    if (a === 0) {
        return { d: b, x: 0, y: 1 };
    } else {
        const result = extendedEuclidean(b % a, a);
        return { d: result.d, x: result.y - Math.floor(b / a) * result.x, y: result.x };
    }
}

// Генерація відкритого ключа
function generatePublicKey(phi) {
    const e = 65537; // Зазвичай використовується 65537 як публічний експонент
    return e;
}

// Генерація закритого ключа
function generatePrivateKey(e, phi) {
    const result = extendedEuclidean(e, phi);
    const d = (result.x % phi + phi) % phi;
    return d;
}

function PushOur() {
    inputValue = document.getElementById("pushValue").value;
    if (stack1.length <= N) {
        const ciphertext = encryptRSA();
        stack1.push(ciphertext);
        encryptedValues.push(ciphertext);
        displayStack();
    } else {
        alert("Stack full");
    }
}

function PopOur() {
    if (stack1.length > 0) {
        const encryptedMessage = stack1.pop();
        const decryptedMessage = decryptRSA(encryptedMessage);
        alert("Pop element " + decryptedMessage);
        displayStack();
    } else {
        alert("Stack empty");
    }
}

function codeToChar(code) {
    return String.fromCharCode(code);
}

function isValidASCII(charCode) {
    // Check if the character code is within the valid ASCII range (32 to 126)
    return charCode >= 32 && charCode <= 126;
}

function displayStack() {
    decryptedStack = stack1.map(encryptedMessage => {
        const decryptedText = decryptRSA(encryptedMessage);
        return decryptedText;
    });

    document.getElementById("displayStack").value = decryptedStack.join(', ');
}

function BackOur() {
    if (stack1.length > 0) {
        const lastEncryptedMessage = stack1[stack1.length - 1];
        const decryptedMessageArray = decryptRSA(lastEncryptedMessage).split(', ');

        if (decryptedMessageArray.length > 1) {
            alert("Last element " + decryptedMessageArray[decryptedMessageArray.length - 1]);
        } else {
            alert("Last element " + decryptedMessageArray[0]);
        }

        displayStack();
    } else {
        alert("Stack empty");
    }
}

function SizeOur() {
    alert("Size stack " + stack1.length);
}

function ClearOur() {
    stack1 = [];
    encryptedValues = []; // Clear encryptedValues array as well
    document.getElementById("displayStack").value = "";
    alert("Cleared ");
}


function ExitOur() {
    alert("Bye");
    window.open('', '_self', '');
    window.close();
}

function encryptRSA() {
    if (inputValue === "") {
        alert("Введіть текст");
    } else {
        console.log("==encryption==");
        let clearText = inputValue.toLowerCase().split('');
        let cipherText = [];
        for (let i = 0; i < clearText.length; i++) {
            let letter = clearText[i];
            let letterIndex = letter.charCodeAt(0);
            let exponentiation = BigInt(letterIndex) ** BigInt(publicKey.e);
            let cipherLetter = exponentiation % BigInt(publicKey.n);
            console.log(letter + " = " + letterIndex + " = " + cipherLetter);
            cipherText.push(cipherLetter);
        }
        console.log(cipherText);
        return cipherText;
    }
}

function decryptRSA(encryptedMessage) {
    console.log("==decryption==");
    let decryptionText = [];
    for (let i = 0; i < encryptedMessage.length; i++) {
        let cipherValue = encryptedMessage[i];
        let decryptionLetterIndex = BigInt(cipherValue) ** BigInt(privateKey.d);
        let decryptionLetter = String.fromCharCode(Number(decryptionLetterIndex % BigInt(privateKey.n)));
        decryptionText.push(decryptionLetter);
    }
    console.log(decryptionText);
    return decryptionText.join('');
}
