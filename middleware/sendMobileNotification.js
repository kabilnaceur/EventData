var Request = require("request");
module.exports = (content, recipient) => {
    let notificationContent = ''
    const notification = JSON.parse(content)
    const notificationVariables = JSON.parse(notification.variables)
    switch (notification.type) {
        case 'comment':
            notificationContent = `${notificationVariables.user.name} has commented to ${notificationVariables.event.name}`
            break;
        case 'like':
            notificationContent = `${notificationVariables.user.name} has liked to ${notificationVariables.event.name}`

            break;
   

        default:
            break;
    }
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "https://exp.host/--/api/v2/push/send",
        body: JSON.stringify({
            to: recipient,
            sound: 'default',
            title: 'Notification',
            body: notificationContent,
            data: notification
        })

    }, (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        console.dir(JSON.parse(body));

    });

}


// mobileNotification("Order Payed", user.notificationToken)
