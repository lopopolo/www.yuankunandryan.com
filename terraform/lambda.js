const https = require("https");
const querystring = require("querystring");
const AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
  try {
    // Validate the recaptcha
    const inputData = JSON.parse(event.body);
    const postData = querystring.stringify({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: inputData["g-recaptcha-response"],
      remoteip: event.requestContext.identity.sourceIp
    });

    const options = {
      hostname: "www.google.com",
      port: 443,
      path: "/recaptcha/api/siteverify",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, res => {
      res.setEncoding("utf8");
      res.on("data", chunk => {
        try {
          const sns = new AWS.SNS();
          const captchaResponse = JSON.parse(chunk);
          if (captchaResponse.success) {
            delete inputData["g-recaptcha-response"];

            const messageLines = [];
            Object.keys(inputData).forEach(key => {
              messageLines.push(`${key}:`);
              messageLines.push(`        ${inputData[key]}`);
              messageLines.push("");
            });
            const message = messageLines.join("\n");

            const params = {
              Message: message,
              Subject: "Yuankun and Ryan Wedding RSVP",
              TopicArn: process.env.SNS_TOPIC
            };

            sns.publish(params, (err, response) => {
              callback(null, {
                statusCode: "200",
                headers: {
                  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                  "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
                },
                body: JSON.stringify(response)
              });
            });
          } else {
            callback(null, {
              statusCode: "500",
              headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
              },
              body: JSON.stringify({ message: "Invalid recaptcha" })
            });
          }
        } catch (err) {
          callback(null, {
            statusCode: "500",
            headers: {
              "Access-Control-Allow-Origin": "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({ err: err.toString, stack: err.stack })
          });
        }
      });
    });

    req.on("error", e => {
      callback(null, {
        statusCode: "500",
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({ message: e.message })
      });
    });

    // write data to request body
    req.write(postData);
    req.end();
  } catch (err) {
    callback(null, {
      statusCode: "500",
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ err: err.toString, stack: err.stack })
    });
  }
};
