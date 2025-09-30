export const templates = {
  sms: {
    stream_to_offer: ({ firstName, link }: any) =>
      `Appreciate you running the new joint. I tucked a little something for you here—${link} (live 24h). No pressure, just perks.`,
    cart_abandon: ({ link }: any) =>
      `Still thinking it over? Your bag's waiting. If you want it, grab it here: ${link}`,
    post_purchase_upsell: ({ link }: any) =>
      `Solid pick. Want the exclusive add-on while it's unlocked? ${link}`,
  },
  email: {
    subject_stream_to_offer: () => "Because you actually listen",
    body_stream_to_offer: ({ firstName, link }: any) =>
      `<p>${firstName ? firstName + "," : ""} appreciate you spinning it.</p>
       <p>Here's a private link for early access—good for 24 hours:</p>
       <p><a href="${link}">${link}</a></p>
       <p>All love, Fendi</p>`
  },
  chat: {
    stream_to_offer: ({ link }: any) =>
      `Thanks for running it. If you want the extras, here's a private lane: ${link} (up for a day).`,
  }
};