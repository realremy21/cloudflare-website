// functions/api/quote.js
export const onRequestPost = async ({ request }) => {
  try {
    const data = await request.json();

    // Prepare MailChannels payload
    const emailPayload = {
      personalizations: [
        {
          to: [{ email: 'quote@milehighsolarcare.com' }],
        },
      ],
      from: {
        email: 'no-reply@milehighsolarcare.com',
        name: 'Mile High Solar Care',
      },
      subject: 'New Quote Submission',
      content: [
        {
          type: 'text/plain',
          value: JSON.stringify(data),
        },
      ],
    };

    const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });

    if (!resp.ok) {
      // fail loudly if email delivery fails
      return new Response(JSON.stringify({ error: 'Email delivery failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
