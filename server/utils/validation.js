export function validateEmail(email) {
    // Regular expression for validating an email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
}

export function validatePassword(password) {
    // Check if the password meets all criteria
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    if (!password.match(/[a-z]/)) {
        return "Password must contain at least one lowercase letter";
    }

    if (!password.match(/[A-Z]/)) {
        return "Password must contain at least one uppercase letter";
    }

    if (!password.match(/[0-9]/)) {
        return "Password must contain at least one digit";
    }

    if (!password.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/)) {
        return "Password must contain at least one special character";
    }

    // If password meets all criteria
    return true;
}