1. Download the Green Mail Standalone JAR
https://greenmail-mail-test.github.io/greenmail/#download_2_1_x

2. Run
java -Dgreenmail.smtp.port=3025 -Dgreenmail.imap.port=3143 -Dgreenmail.hostname=0.0.0.0 -jar greenmail-standalone.jar	

3. Testing using Telnet

telnet localhost 3025

EHLO localhost
MAIL FROM: <your_email@example.com>
RCPT TO: <recipient@example.com>
DATA
Subject: Test Email

This is the body of the test email.
.
QUIT

