// Dynamic import to avoid build-time issues
let resend: any = null;

async function getResend() {
  if (!resend) {
    const { Resend } = await import('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface MeetupInvitationEmail {
  to: string;
  meetupTitle: string;
  meetupDate: string;
  meetupLocation: string;
  organizerName: string;
  invitationLink: string;
}

export interface WelcomeEmail {
  to: string;
  userName: string;
}

export interface MeetupConfirmationEmail {
  to: string;
  participantName: string;
  meetupTitle: string;
  meetupDate: string;
  meetupTime: string;
  meetupLocation: string;
  cafeName: string;
  cafeAddress: string;
  otherParticipantName: string;
  otherParticipantEmail: string;
}

export interface MeetupConfirmationEmailData {
  organizerName: string;
  organizerEmail: string;
  inviteeName: string;
  inviteeEmail: string;
  cafe: {
    name: string;
    address: string;
    description?: string;
  };
  availableDates: string[];
  availableTimes: string[];
  chosenDate?: string;
  chosenTime?: string;
}

export interface InviteEmailData {
  to: string;
  cafe: {
    name: string;
    address: string;
    priceRange: string;
    rating: number;
    openHours: string;
  };
  dates: string[];
  times?: string[];
  token: string;
  inviteLink?: string;
  organizerName: string;
}

export interface CalendarInviteData {
  to: string;
  eventTitle: string;
  eventDescription: string;
  eventLocation: string;
  eventStartTime: string;
  eventEndTime: string;
  attendeeName: string;
}

/**
 * Send a generic email using Resend
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const resendInstance = await getResend();
    const { data, error } = await resendInstance.emails.send({
      from: options.from || process.env.EMAIL_FROM || 'noreply@anemi-meets.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Send meetup confirmation email with calendar invite
 */
export async function sendMeetupConfirmation(emailData: MeetupConfirmationEmail) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Create calendar event data
  const eventStartTime = new Date(`${emailData.meetupDate}T${emailData.meetupTime}`)
  const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000) // 1 hour duration
  
  const calendarData = {
    eventTitle: emailData.meetupTitle,
    eventDescription: `Koffie meetup bij ${emailData.cafeName} met ${emailData.otherParticipantName}`,
    eventLocation: `${emailData.cafeName}, ${emailData.cafeAddress}`,
    eventStartTime: eventStartTime.toISOString(),
    eventEndTime: eventEndTime.toISOString(),
    attendeeName: emailData.participantName
  }

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Meetup Bevestigd!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Je koffie avontuur is officieel gepland</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé ${emailData.participantName}! 👋</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Geweldig nieuws! Je koffie meetup met <strong>${emailData.otherParticipantName}</strong> is bevestigd. 
          Hier zijn alle details die je nodig hebt:
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📅 Meetup Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>Evenement:</strong> ${emailData.meetupTitle}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Datum:</strong> ${emailData.meetupDate}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Tijd:</strong> ${emailData.meetupTime}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Café:</strong> ${emailData.cafeName}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Adres:</strong> ${emailData.cafeAddress}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Ontmoeting met:</strong> ${emailData.otherParticipantName} (${emailData.otherParticipantEmail})</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0D%0AVERSION:2.0%0D%0ABEGIN:VEVENT%0D%0ADTSTART:${eventStartTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z%0D%0ADTEND:${eventEndTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z%0D%0ASUMMARY:${encodeURIComponent(calendarData.eventTitle)}%0D%0ADESCRIPTION:${encodeURIComponent(calendarData.eventDescription)}%0D%0ALOCATION:${encodeURIComponent(calendarData.eventLocation)}%0D%0AEND:VEVENT%0D%0AEND:VCALENDAR" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;"
             download="koffie-meetup.ics">
            📅 Toevoegen aan Agenda
          </a>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Tips voor een Geweldige Meetup:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Kom een paar minuten eerder om een goede plek te vinden</li>
            <li>Neem contant geld mee voor het geval het café geen kaarten accepteert</li>
            <li>Vergeet niet contactgegevens uit te wisselen als je dat nog niet hebt gedaan</li>
            <li>Deel foto's van je meetup met de community!</li>
            <li>Ontdek samen nieuwe lokale spots in je stad</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" 
             style="background-color: #10b981; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            📱 Bekijk in App
          </a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Veel plezier bij je koffie meetup! ☕<br>
          <strong>Het Anemi Meets Team</strong>
        </p>
        <div style="margin-top: 15px;">
          <a href="${siteUrl}" 
             style="color: #f59e0b; text-decoration: none; font-size: 14px;">
            Bezoek Anemi Meets
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: emailData.to,
    subject: `☕ Bevestigd: ${emailData.meetupTitle} - ${emailData.meetupDate} om ${emailData.meetupTime}`,
    html,
  });
}

/**
 * Send meetup confirmation emails to both organizer and invitee
 */
export async function sendMeetupConfirmationEmail(data: MeetupConfirmationEmailData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Meetup Bevestigd!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Je koffie meetup is nu bevestigd</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Geweldig nieuws! 🎉</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Je koffie meetup is geaccepteerd! Nu is het tijd om de details te coördineren.
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 Meetup Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>Organisator:</strong> ${data.organizerName}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Uitgenodigde:</strong> ${data.inviteeName}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Café:</strong> ${data.cafe.name}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Adres:</strong> ${data.cafe.address}</p>
          ${data.cafe.description ? `<p style="margin: 8px 0; color: #92400e;"><strong>Beschrijving:</strong> ${data.cafe.description}</p>` : ''}
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">📅 Meetup Details</h3>
          ${data.chosenDate && data.chosenTime ? `
            <div style="background-color: #dcfce7; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #16a34a;">
              <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">✅ Bevestigde Datum & Tijd</h4>
              <p style="color: #166534; margin: 5px 0;"><strong>Datum:</strong> ${new Date(data.chosenDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="color: #166534; margin: 5px 0;"><strong>Tijd:</strong> ${data.chosenTime}</p>
            </div>
          ` : `
            <p style="color: #0c4a6e; margin: 8px 0;"><strong>Beschikbare Datums:</strong> ${data.availableDates.map(date => new Date(date).toLocaleDateString('nl-NL')).join(', ')}</p>
            <p style="color: #0c4a6e; margin: 8px 0;"><strong>Beschikbare Tijden:</strong> ${data.availableTimes.join(', ')}</p>
          `}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
            📱 Bekijk in App
          </a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Veel plezier bij je koffie meetup! ☕<br>
          <strong>Het Anemi Meets Team</strong>
        </p>
        <div style="margin-top: 15px;">
          <a href="${siteUrl}" 
             style="color: #f59e0b; text-decoration: none; font-size: 14px;">
            Bezoek Anemi Meets
          </a>
        </div>
      </div>
    </div>
  `;

  // Send email to organizer
  await sendEmail({
    to: data.organizerEmail,
    subject: `☕ Meetup Bevestigd: ${data.inviteeName} heeft zich aangesloten bij je koffie meetup!`,
    html,
  });

  // Send email to invitee
  await sendEmail({
    to: data.inviteeEmail,
    subject: `☕ Meetup Bevestigd: Je hebt zich aangesloten bij ${data.organizerName}'s koffie meetup!`,
    html,
  });
}

/**
 * Send welcome email to new users after verification
 */
export async function sendWelcomeEmailAfterVerification(emailData: WelcomeEmail) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎉 Welkom bij Anemi Meets!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Je koffie avontuur is officieel gestart</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé ${emailData.userName}! 👋</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Gefeliciteerd! Je e-mail is geverifieerd en je bent nu een onderdeel van de Anemi Meets community. 
          Klaar om wondervolle koffiewinkels te ontdekken en samen te verbinden met andere koffie liefhebbers!
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🚀 Wat je nu kunt doen:</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Ontdek lokale koffiewinkels met beoordelingen en reviews ☕</li>
            <li>Deel meetups of maak je eigen koffie avonturen 👥</li>
            <li>Verbonden met koffie liefhebbers in je buurt 💫</li>
            <li>Ontvang persoonlijke koffie aanbevelingen 🗺️</li>
            <li>Deel je koffie ontdekkingen met de community 📸</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/explore" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
            🗺️ Start Explorando
          </a>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Tips voor een Geweldige Avontuur:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Voltooi je profiel om betere aanbevelingen te krijgen</li>
            <li>Volg koffiewinkels die je leuk vindt om op de hoogte te blijven</li>
            <li>Doe mee aan onze community discussies over koffie</li>
            <li>Deel je favoriete koffie spots met vrienden</li>
          </ul>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Klaar om je koffie avontuur te starten?<br>
          <strong>Het Anemi Meets Team</strong>
        </p>
        <div style="margin-top: 15px;">
          <a href="${siteUrl}" 
             style="color: #f59e0b; text-decoration: none; font-size: 14px;">
            Bezoek Anemi Meets
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: emailData.to,
    subject: '🎉 Welkom bij Anemi Meets! Je koffie avontuur begint nu',
    html,
  });
}

/**
 * Send meetup invitation email
 */
export async function sendMeetupInvitation(emailData: MeetupInvitationEmail) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">☕ Je bent uitgenodigd voor een koffie meetup!</h2>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${emailData.meetupTitle}</h3>
        <p style="margin: 5px 0;"><strong>📅 Datum:</strong> ${emailData.meetupDate}</p>
        <p style="margin: 5px 0;"><strong>📍 Locatie:</strong> ${emailData.meetupLocation}</p>
        <p style="margin: 5px 0;"><strong>👤 Organisator:</strong> ${emailData.organizerName}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${emailData.invitationLink}" 
           style="background-color: #f59e0b; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Deel Meetup
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Deze uitnodiging werd verzonden vanuit Anemi Meets. 
        Verbind je met koffie liefhebbers in je gemeenschap!
      </p>
    </div>
  `;

  return sendEmail({
    to: emailData.to,
    subject: `☕ Je bent uitgenodigd: ${emailData.meetupTitle}`,
    html,
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(emailData: WelcomeEmail) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">☕ Welkom bij Anemi Meets!</h2>
      
      <p>Hé ${emailData.userName},</p>
      
      <p>Welkom bij Anemi Meets! We zijn enthousiast om je te helpen wondervolle koffiewinkels 
      en mensen met dezelfde interesses in je buurt te verbinden.</p>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0;">Wat je kunt doen:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Ontdek lokale koffiewinkels met beoordelingen en reviews</li>
          <li>Deel meetups of maak je eigen</li>
          <li>Verbonden met koffie liefhebbers in je buurt</li>
          <li>Ontvang persoonlijke koffie aanbevelingen</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL}/explore" 
           style="background-color: #f59e0b; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Start Explorando
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Veel plezier bij je koffie avonturen!<br>
        Het Anemi Meets Team
      </p>
    </div>
  `;

  return sendEmail({
    to: emailData.to,
    subject: '☕ Welkom bij Anemi Meets!',
    html,
  });
}

/**
 * Send meetup reminder email
 */
export async function sendMeetupReminder(
  to: string,
  meetupTitle: string,
  meetupDate: string,
  meetupLocation: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">☕ Meetup Herinnering</h2>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${meetupTitle}</h3>
        <p style="margin: 5px 0;"><strong>📅 Datum:</strong> ${meetupDate}</p>
        <p style="margin: 5px 0;"><strong>📍 Locatie:</strong> ${meetupLocation}</p>
      </div>
      
      <p>Vergeet je koffie meetup niet! We kijken ernaar uit om je daar te zien.</p>
      
      <p style="color: #6b7280; font-size: 14px;">
        Deze herinnering werd verzonden vanuit Anemi Meets.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `☕ Herinnering: ${meetupTitle}`,
    html,
  });
}

/**
 * Send meetup cancellation email
 */
export async function sendMeetupCancellation(
  to: string,
  meetupTitle: string,
  meetupDate: string,
  reason?: string
) {
  console.log('📧 sendMeetupCancellation called with:', { to, meetupTitle, meetupDate, reason })
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">☕ Meetup Geannuleerd</h2>
      
      <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${meetupTitle}</h3>
        <p style="margin: 5px 0;"><strong>📅 Datum:</strong> ${meetupDate}</p>
        ${reason ? `<p style="margin: 5px 0;"><strong>Reden:</strong> ${reason}</p>` : ''}
      </div>
      
      <p>Helaas, deze meetup is geannuleerd. We zullen je op de hoogte brengen van eventuele herschoven evenementen.</p>
      
      <p style="color: #6b7280; font-size: 14px;">
        Deze melding werd verzonden vanuit Anemi Meets.
      </p>
    </div>
  `;

  try {
    const result = await sendEmail({
      to,
      subject: `☕ Geannuleerd: ${meetupTitle}`,
      html,
    })
    
    console.log('✅ sendMeetupCancellation email sent successfully to:', to)
    return result
  } catch (error) {
    console.error('❌ sendMeetupCancellation failed:', error)
    throw error
  }
}

/**
 * Generate HTML template for invite email
 */
function generateInviteEmailHTML(data: InviteEmailData): string {
  const datesList = data.dates.map(date => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }).join(', ');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">☕ Koffie Meetup Uitnodiging</h2>
      
      <p>Hé!</p>
      
      <p>Je bent uitgenodigd om deel te nemen aan een koffie meetup bij <strong>${data.cafe.name}</strong>!</p>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0;">Meetup Details</h3>
        <p style="margin: 5px 0;"><strong>📍 Café:</strong> ${data.cafe.name}</p>
        <p style="margin: 5px 0;"><strong>🏠 Adres:</strong> ${data.cafe.address}</p>
        <p style="margin: 5px 0;"><strong>💰 Prijs Bereik:</strong> ${data.cafe.priceRange}</p>
        <p style="margin: 5px 0;"><strong>⭐ Beoordeling:</strong> ${data.cafe.rating}/5</p>
        <p style="margin: 5px 0;"><strong>🕒 Uren:</strong> ${data.cafe.openHours}</p>
        <p style="margin: 5px 0;"><strong>📅 Datums:</strong> ${datesList}</p>
        ${data.times ? `<p style="margin: 5px 0;"><strong>⏰ Tijden:</strong> ${data.times.join(', ')}</p>` : ''}
        <p style="margin: 5px 0;"><strong>👤 Organisator:</strong> ${data.organizerName}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.inviteLink || '#'}" 
           style="background-color: #f59e0b; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Deel Meetup
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Deze uitnodiging werd verzonden vanuit Anemi Meets. 
        Verbind je met koffie liefhebbers in je gemeenschap!
      </p>
    </div>
  `;
}

/**
 * Send invite email
 */
export async function sendInviteEmail(data: InviteEmailData) {
  return sendEmail({
    to: data.to,
    subject: `☕ Je bent uitgenodigd: Koffie meetup bij ${data.cafe.name}`,
    html: generateInviteEmailHTML(data),
  });
}

/**
 * Send calendar invite email
 */
export async function sendCalendarInvite(data: CalendarInviteData) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">📅 Agenda Uitnodiging</h2>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${data.eventTitle}</h3>
        <p style="margin: 5px 0;"><strong>📝 Beschrijving:</strong> ${data.eventDescription}</p>
        <p style="margin: 5px 0;"><strong>📍 Locatie:</strong> ${data.eventLocation}</p>
        <p style="margin: 5px 0;"><strong>⏰ Start Tijd:</strong> ${data.eventStartTime}</p>
        <p style="margin: 5px 0;"><strong>⏰ Eind Tijd:</strong> ${data.eventEndTime}</p>
        <p style="margin: 5px 0;"><strong>👤 Aanwezige:</strong> ${data.attendeeName}</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Deze agenda uitnodiging werd verzonden vanuit Anemi Meets.
      </p>
    </div>
  `;

  return sendEmail({
    to: data.to,
    subject: `📅 Agenda Uitnodiging: ${data.eventTitle}`,
    html,
  });
} 