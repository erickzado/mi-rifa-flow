exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    
    console.log("Confirmación de Flow:", data);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ received: true })
    };
};
