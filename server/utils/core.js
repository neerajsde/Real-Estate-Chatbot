function shuffleString(str) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap characters
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

export function generatePassword(length, includeNumber=true, includeUppercase=false, includeLowercase=false, includeSymbol=false) {
  const numbers = '0123456789';
  const symbols = '!@#$&_+?';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let validChars = '';
  if (includeNumber) validChars += numbers;
  if (includeUppercase) validChars += uppercase;
  if (includeLowercase) validChars += lowercase;
  if (includeSymbol) validChars += symbols;

  if (validChars.length === 0) {
    return 'Error: No character types selected.';
  }
  validChars = shuffleString(validChars);

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * validChars.length);
    password += validChars[randomIndex];
  }

  return password;
}
