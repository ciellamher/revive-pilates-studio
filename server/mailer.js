// The one place email leaves the server.
//
// With GMAIL_USER and GMAIL_APP_PASSWORD set, mail is really delivered through
// that Gmail account. Without them it goes to an Ethereal test inbox instead:
// nothing reaches the recipient, and a preview link is printed to the console.
// That is the right behaviour on a laptop and the wrong one on a live site, so
// set both variables on your host.

import nodemailer from 'nodemailer'

const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env
const USING_GMAIL = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD)

let transporterPromise

function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = USING_GMAIL
      ? Promise.resolve(nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        }))
      : nodemailer.createTestAccount().then((account) => {
          console.warn('GMAIL_USER / GMAIL_APP_PASSWORD are not set: email goes to an Ethereal test inbox and is NOT delivered.')
          return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: account.user, pass: account.pass },
          })
        })
    // A failed setup should be retried on the next send, not remembered.
    transporterPromise.catch(() => { transporterPromise = undefined })
  }
  return transporterPromise
}

// Returns the Ethereal preview link in test mode, otherwise undefined.
export async function sendMail({ to, subject, html }) {
  const transporter = await getTransporter()
  const info = await transporter.sendMail({
    from: `"Revive Pilates Studio" <${USING_GMAIL ? GMAIL_USER : 'noreply@revivestudio.com'}>`,
    to,
    subject,
    html,
  })
  const previewUrl = nodemailer.getTestMessageUrl(info) || undefined
  if (previewUrl) console.log('Email sent! Preview URL: %s', previewUrl)
  return previewUrl
}

// Names and class titles are typed in by people, so they are escaped before
// they go into an HTML email.
const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

// '2026-10-01' -> 'Thursday, October 1'. Parsed and formatted as UTC so the
// server's own timezone cannot move the day.
const formatDate = (isoDate) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  })

const layout = (heading, body) => `
  <div style="font-family: sans-serif; padding: 20px; color: #3A2A20;">
    <h2>${heading}</h2>
    ${body}
    <p style="margin-top: 24px; font-size: 13px; color: #8a7f76;">Revive Pilates Studio</p>
  </div>`

const classDetails = (r) => `
  <p style="line-height: 1.6;">
    <strong>${escapeHtml(r.title)}</strong> with ${escapeHtml(r.instructor)}<br>
    ${formatDate(r.date)} at ${escapeHtml(r.time)}<br>
    ${escapeHtml(r.branch)} Branch, spot ${r.spot}
  </p>`

export function sendReminder(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `Reminder: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('See you in class', `
      <p>Hi ${escapeHtml(recipient.name)}, this is a reminder of your upcoming class.</p>
      ${classDetails(recipient)}
      <p>Please arrive a few minutes early. If you are more than 15 minutes late your session may be forfeited.</p>`),
  })
}

export function sendConfirmation(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `Booking confirmed: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('Your booking is confirmed', `
      <p>Hi ${escapeHtml(recipient.name)}, we have verified your payment and your spot is reserved.</p>
      ${classDetails(recipient)}
      <p>We will email you a reminder about 12 hours before the class. To reschedule or cancel, let us know at least 12 hours before your session.</p>`),
  })
}

export function sendCancellation(recipient) {
  return sendMail({
    to: recipient.email,
    subject: `Cancelled: ${recipient.title} on ${formatDate(recipient.date)} at ${recipient.time}`,
    html: layout('Your class has been cancelled', `
      <p>Hi ${escapeHtml(recipient.name)}, we are sorry, the studio has had to cancel this class.</p>
      ${classDetails(recipient)}
      <p>Please reply to this email or message the studio to rebook or arrange a refund.</p>`),
  })
}
