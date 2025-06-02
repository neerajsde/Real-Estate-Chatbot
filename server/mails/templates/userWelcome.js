export default function sendUserWelcomeMail(name, email) {
    const currentYear = new Date().getFullYear();

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${process.env.APP_NAME}</title>
            <style>
                body {
                    background-color: #f4f4f4;
                    font-family: 'Arial', sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 30px auto;
                    background-color: #fff;
                    padding: 25px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    text-align: left;
                }
                .logo {
                    max-width: 120px;
                    margin-bottom: 20px;
                    display: block;
                }
                .heading {
                    font-size: 26px;
                    font-weight: bold;
                    color: #28a745;
                    margin-bottom: 20px;
                }
                .message {
                    font-size: 16px;
                    margin-bottom: 20px;
                    color: #555;
                }
                .info-box {
                    background-color: #e8f5e9;
                    padding: 15px 20px;
                    border-radius: 8px;
                    border: 1px solid #28a745;
                    color: #1b5e20;
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 14px;
                    color: #777;
                    text-align: center;
                    margin-top: 30px;
                }
                a {
                    color: #28a745;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                @media (max-width: 600px) {
                    .container {
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="${process.env.LOGO_URL}" alt="app-logo" class="logo" />

                <h2 class="heading">Welcome to ${process.env.APP_NAME}!</h2>

                <div class="message">
                    <p>Hi ${name},</p>
                    <p>Thank you for creating an account with <strong>${process.env.APP_NAME}</strong>! We’re thrilled to have you on board.</p>
                </div>

                <div class="info-box">
                    <p><strong>Email:</strong> ${email}</p>
                    <p>You can now log in and start exploring our platform.</p>
                </div>

                <div class="message">
                    <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
                </div>

                <div class="footer">
                    <p>Contact us: <a href="mailto:${process.env.CUSTOMER_SUPPORT_EMAIL}">${process.env.CUSTOMER_SUPPORT_EMAIL}</a></p>
                    <p>Warm regards,</p>
                    <p><strong>${process.env.APP_NAME} Team</strong></p>
                    <p>© ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
