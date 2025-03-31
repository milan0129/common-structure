module.exports = function (user_type = 'c') {
    let description = `We can't wait for you post and <br> interact with our makeup community.`;

    if (user_type == 'm') {
        description = `The WAM platform is the perfect app for all <br> makeup artists. If you're running your established <br> business or beginning your makeup journey, <br> We Are Makeup is the only place to do it.`
    }

    return `<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<title>Welcome to the We Are Makeup community</title>
</head>
<body>
<br/>
<center>
<img src="https://hlik-deep-bhaumik.s3.amazonaws.com/we_are_makeup/other/logo.png" />
<br>
<img src="https://hlik-deep-bhaumik.s3.amazonaws.com/we_are_makeup/other/mail1.png" />
<p>
${description}
</p>
</center>

</body>
</html>`
}