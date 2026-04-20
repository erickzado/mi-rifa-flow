const crypto = require('crypto');

exports.handler = async (event) => {
    const API_KEY = "4CA6FD8D-2B9F-4503-849D-1L7370B6E8FF";
    const SECRET_KEY = "64c5d822e02f34e4a7fb24fa7a8eb9e3e75f667a";
    
    const { numero, nombre, email, monto } = JSON.parse(event.body);
    
    const params = {
        apiKey: API_KEY,
        commerceOrder: `${Date.now()}-${numero}`,
        subject: `Número ${numero} - Rifa`,
        amount: monto,
        email: email,
        urlConfirmation: "https://rifasloto3.netlify.app/.netlify/functions/flow-webhook",
        urlReturn: "https://rifasloto3.netlify.app/success.html",
        paymentMethod: 9
    };
    
    const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    params.s = crypto.createHmac('sha256', SECRET_KEY).update(sortedParams).digest('hex');
    
    const response = await fetch('https://www.flow.cl/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params)
    });
    
    const data = await response.json();
    
    return {
        statusCode: 200,
        body: JSON.stringify({ url: data.url, token: data.token })
    };
};
