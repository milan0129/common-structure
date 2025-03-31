module.exports = (data) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
        }
        .header {
            background: #333;
            color: #fff;
            padding: 10px 0;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            margin: 10px 0;
        }
        .footer {
            background: #333;
            color: #fff;
            text-align: center;
            padding: 10px 0;
            border-radius: 0 0 5px 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!--<div class="header">-->
        <!--    <h2>Contact Us</h2>-->
        <!--</div>-->
        <div class="content">

            <p>Hello,</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Here are the details you provided:</p>
            <ul>
                <li><strong>Email:</strong> ${data.email}</li>
                <li><strong>Subject:</strong> ${data.subject}</li>
                <li><strong>Description:</strong> ${data.description}</li>
            </ul>
            <p>We appreciate your patience.</p>
            <p>Best regards,</p>
            <p>The Contact Us Team</p>



        </div>
        <!--<div class="footer">-->
        <!--    <p>This is an automated message. Please do not reply.</p>-->
        <!--</div>-->
    </div>
</body>
</html>`;