const stripe = require('stripe')('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');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { priceId, deviceFingerprint } = JSON.parse(event.body);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Stripe auto-enables Apple/Google Pay
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: 'https://catzone.app/success.html?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://catzone.app/?canceled=true',
            metadata: {
                deviceFingerprint: deviceFingerprint
            },
            allow_promotion_codes: true, // Allow discount codes
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ id: session.id })
        };
    } catch (error) {
        console.error('Stripe error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
