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

export interface PasswordResetEmail {
  to: string;
  resetLink: string;
  userName?: string;
}

export interface EmailVerificationEmail {
  to: string;
  verificationLink: string;
  userName?: string;
}

/**
 * Send a generic email using Resend
 */
export async function sendEmail(options: EmailOptions) {
  try {
    // Check if emails are disabled
    if (process.env.DISABLE_EMAILS === 'true') {
      console.log('📧 Email disabled (DISABLE_EMAILS=true), skipping email to:', options.to);
      return { success: true, data: { id: 'disabled', to: options.to } };
    }

    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured. Please set this environment variable.');
    }

    // Validate email address
    if (!options.to || !options.to.includes('@')) {
      throw new Error(`Invalid email address: ${options.to}`);
    }

    console.log(`📧 Attempting to send email to: ${options.to} with subject: ${options.subject}`);

    const resendInstance = await getResend();
    const fromEmail = options.from || process.env.EMAIL_FROM || 'noreply@anemi-meets.com';
    
    const { data, error } = await resendInstance.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw new Error(`Email service error: ${error.message || JSON.stringify(error)}`);
    }

    console.log('✅ Email sent successfully:', { id: data?.id, to: options.to });
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ Failed to send email:', {
      error: errorMessage,
      to: options.to,
      subject: options.subject,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasEmailFrom: !!process.env.EMAIL_FROM
    });
    return { success: false, error: errorMessage };
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Koffie Meetup Uitnodiging!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Je bent uitgenodigd voor een gezellige koffie meetup</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé daar! ☕</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Geweldig nieuws! <strong>${emailData.organizerName}</strong> heeft je uitgenodigd voor een gezellige koffie meetup. 
          Dit wordt een geweldige gelegenheid om nieuwe mensen te ontmoeten en geweldige koffie te proeven!
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 Meetup Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>📅 Evenement:</strong> ${emailData.meetupTitle}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📅 Datum:</strong> ${emailData.meetupDate}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📍 Locatie:</strong> ${emailData.meetupLocation}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>👤 Organisator:</strong> ${emailData.organizerName}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${emailData.invitationLink}" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
            ☕ Bekijk Uitnodiging
          </a>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Wat kun je verwachten:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Gezellige sfeer met andere koffie liefhebbers</li>
            <li>Ontdekking van nieuwe koffie spots</li>
            <li>Leuke gesprekken en nieuwe vriendschappen</li>
            <li>Geweldige koffie ervaringen delen</li>
          </ul>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          We kijken uit naar je komst! ☕<br>
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
    subject: `☕ Je bent uitgenodigd: ${emailData.meetupTitle}`,
    html,
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(emailData: WelcomeEmail) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Welkom bij Anemi Meets!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Je koffie avontuur begint hier</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé ${emailData.userName}! 👋</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Wat geweldig dat je je hebt aangemeld bij <strong>Anemi Meets</strong>! We zijn super enthousiast om je te verwelkomen in onze gezellige community van koffieliefhebbers. 
          Samen gaan we de leukste cafés ontdekken en geweldige koffie momenten delen.
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🚀 Wat je nu kunt doen:</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>🗺️ Ontdek lokale koffiewinkels met beoordelingen en reviews ☕</li>
            <li>👥 Deel meetups of maak je eigen koffie avonturen</li>
            <li>💫 Verbind met koffie liefhebbers in je buurt</li>
            <li>⭐ Ontvang persoonlijke koffie aanbevelingen</li>
            <li>📸 Deel je koffie ontdekkingen met de community</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" 
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
    subject: '☕ Welkom bij Anemi Meets! Je koffie avontuur begint nu',
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">⏰ Meetup Herinnering</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Vergeet je koffie meetup niet!</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé daar! ☕</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Dit is een vriendelijke herinnering voor je aankomende koffie meetup. 
          We kijken er naar uit om je daar te zien en een geweldige tijd te hebben!
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 Meetup Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>📅 Evenement:</strong> ${meetupTitle}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📅 Datum:</strong> ${meetupDate}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📍 Locatie:</strong> ${meetupLocation}</p>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Tips voor een Geweldige Meetup:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Kom op tijd om de beste plek te vinden</li>
            <li>Neem je favoriete koffie verhalen mee</li>
            <li>Wees open voor nieuwe koffie ervaringen</li>
            <li>Deel je koffie kennis met anderen</li>
          </ul>
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

  return sendEmail({
    to,
    subject: `⏰ Herinnering: ${meetupTitle}`,
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
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Meetup Geannuleerd</h1>
        <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Helaas is deze meetup afgelast</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé daar! ☕</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Helaas moeten we je laten weten dat de volgende koffie meetup is geannuleerd. 
          We begrijpen dat dit teleurstellend is, maar we hopen je snel weer te zien bij een andere meetup!
        </p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">📋 Geannuleerde Meetup</h3>
          <p style="margin: 8px 0; color: #991b1b;"><strong>📅 Evenement:</strong> ${meetupTitle}</p>
          <p style="margin: 8px 0; color: #991b1b;"><strong>📅 Geplande Datum:</strong> ${meetupDate}</p>
          ${reason ? `<p style="margin: 8px 0; color: #991b1b;"><strong>📝 Reden:</strong> ${reason}</p>` : ''}
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Wat kun je nu doen:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Bekijk andere beschikbare meetups in je buurt</li>
            <li>Maak je eigen koffie meetup aan</li>
            <li>Ontdek nieuwe cafés in je omgeving</li>
            <li>Blijf verbonden met de koffie community</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
            🗺️ Ontdek Nieuwe Meetups
          </a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          We hopen je snel weer te zien! ☕<br>
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const datesList = data.dates.map(date => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('nl-NL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }).join(', ');

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Koffie Meetup Uitnodiging!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Je bent uitgenodigd voor een gezellige koffie meetup</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé daar! ☕</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Geweldig nieuws! <strong>${data.organizerName}</strong> heeft je uitgenodigd voor een gezellige koffie meetup bij <strong>${data.cafe.name}</strong>. 
          Dit wordt een geweldige gelegenheid om nieuwe mensen te ontmoeten en geweldige koffie te proeven!
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 Meetup Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>📍 Café:</strong> ${data.cafe.name}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>🏠 Adres:</strong> ${data.cafe.address}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>💰 Prijs Bereik:</strong> ${data.cafe.priceRange}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>⭐ Beoordeling:</strong> ${data.cafe.rating}/5</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>🕒 Openingstijden:</strong> ${data.cafe.openHours}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📅 Beschikbare Datums:</strong> ${datesList}</p>
          ${data.times ? `<p style="margin: 8px 0; color: #92400e;"><strong>⏰ Beschikbare Tijden:</strong> ${data.times.join(', ')}</p>` : ''}
          <p style="margin: 8px 0; color: #92400e;"><strong>👤 Organisator:</strong> ${data.organizerName}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.inviteLink || '#'}" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
            ☕ Bekijk Uitnodiging
          </a>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">🔑 Invite Code</h3>
          <p style="color: #0c4a6e; font-size: 14px; margin: 0 0 10px 0;">
            Wil je deze uitnodiging doorsturen naar iemand anders? Gebruik dan deze invite code:
          </p>
          <div style="background-color: #ffffff; border: 2px solid #0ea5e9; border-radius: 6px; padding: 12px; margin: 10px 0;">
            <code style="color: #0c4a6e; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace; letter-spacing: 1px;">
              ${data.token}
            </code>
          </div>
          <p style="color: #0c4a6e; font-size: 12px; margin: 10px 0 0 0; font-style: italic;">
            📋 Klik op de code hierboven om deze te kopiëren, of deel de volledige link: ${data.inviteLink}
          </p>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Wat kun je verwachten:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Gezellige sfeer met andere koffie liefhebbers</li>
            <li>Ontdekking van nieuwe koffie spots</li>
            <li>Leuke gesprekken en nieuwe vriendschappen</li>
            <li>Geweldige koffie ervaringen delen</li>
          </ul>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          We kijken uit naar je komst! ☕<br>
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
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetEmail) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🔐 Wachtwoord Reset</h1>
        <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Herstel toegang tot je account</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hallo${data.userName ? ` ${data.userName}` : ''}! 👋</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          We hebben een verzoek ontvangen om het wachtwoord voor je Anemi Meets account te resetten. 
          Klik op de onderstaande knop om een nieuw wachtwoord in te stellen.
        </p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">🔒 Wachtwoord Reset Link</h3>
          <p style="margin: 8px 0; color: #991b1b;">Deze link is <strong>24 uur geldig</strong> en kan maar één keer gebruikt worden.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3); transition: all 0.3s ease;">
            🔓 Reset Mijn Wachtwoord
          </a>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">🛡️ Veiligheid Tips:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Kies een sterk wachtwoord van minimaal 8 karakters</li>
            <li>Gebruik een combinatie van letters, cijfers en symbolen</li>
            <li>Deel je wachtwoord nooit met anderen</li>
            <li>Overweeg het gebruik van een wachtwoord manager</li>
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">⚠️ Heb je dit niet aangevraagd?</h3>
          <p style="color: #92400e; margin: 0;">
            Als je geen wachtwoord reset hebt aangevraagd, kun je deze email veilig negeren. 
            Je account blijft beveiligd en er worden geen wijzigingen aangebracht.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/contact" 
             style="background-color: #6b7280; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            📞 Contact Ondersteuning
          </a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Je account veiligheid is onze prioriteit.<br>
          <strong>Het Anemi Meets Team</strong>
        </p>
        <div style="margin-top: 15px;">
          <a href="${siteUrl}" 
             style="color: #dc2626; text-decoration: none; font-size: 14px;">
            Bezoek Anemi Meets
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.to,
    subject: '🔐 Wachtwoord Reset - Anemi Meets',
    html,
  });
}

/**
 * Send email verification email
 */
export async function sendEmailVerificationEmail(data: EmailVerificationEmail) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Welkom bij Anemi Meets!</h1>
        <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 16px;">Bevestig je email adres</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hallo${data.userName ? ` ${data.userName}` : ''}! ☕</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Wat geweldig dat je je hebt aangemeld bij <strong>Anemi Meets</strong>! We zijn super enthousiast om je te verwelkomen in onze gezellige community van koffieliefhebbers. 
          Om te beginnen met het plannen van geweldige koffie meetups, hoef je alleen maar je email adres te bevestigen.
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">✅ Email Verificatie</h3>
          <p style="margin: 8px 0; color: #92400e;">Deze link is <strong>24 uur geldig</strong>. Klik op de knop hieronder om je account te activeren.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationLink}" 
             style="background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(217, 119, 6, 0.3); transition: all 0.3s ease;">
            ☕ Verifieer Mijn Email
          </a>
        </div>
        
        <div style="background-color: #fed7aa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
          <h3 style="color: #c2410c; margin: 0 0 15px 0; font-size: 18px;">☕ Wat kun je straks doen:</h3>
          <ul style="color: #c2410c; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>🗓️ Gezellige koffie meetups plannen met vrienden</li>
            <li>🏪 Ontdek de leukste cafés in jouw stad</li>
            <li>💬 Deel je koffie ervaringen met andere liefhebbers</li>
            <li>⭐ Ontvang persoonlijke café aanbevelingen</li>
            <li>📱 Eenvoudig uitnodigingen versturen en ontvangen</li>
          </ul>
        </div>
        
        <div style="background-color: #ffedd5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
          <h3 style="color: #ea580c; margin: 0 0 15px 0; font-size: 18px;">🔒 Jouw Privacy Is Veilig:</h3>
          <ul style="color: #ea580c; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>🛡️ We slaan je persoonlijke gegevens veilig op</li>
            <li>🚫 Je email wordt nooit gedeeld met derden</li>
            <li>⚙️ Je hebt altijd controle over je account</li>
            <li>📧 We sturen alleen relevante koffie-updates</li>
          </ul>
        </div>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">🤔 Lukt het niet?</h3>
          <p style="color: #991b1b; margin: 0;">
            Als de knop niet werkt, kun je deze link handmatig kopiëren naar je browser:<br>
            <span style="word-break: break-all; font-family: monospace; background: #fff; padding: 4px; border-radius: 4px; font-size: 12px;">${data.verificationLink}</span>
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/" 
             style="background-color: #f97316; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            🏠 Naar Anemi Meets
          </a>
        </div>
      </div>
      
      <div style="background-color: #fef3c7; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #92400e; font-size: 14px; margin: 0;">
          Proost op geweldige koffie momenten! ☕<br>
          <strong>Het Anemi Meets Team</strong><br>
          <span style="font-size: 12px; color: #a16207;">P.S. We kijken uit naar je eerste meetup!</span>
        </p>
        <div style="margin-top: 15px;">
          <a href="${siteUrl}" 
             style="color: #16a34a; text-decoration: none; font-size: 14px;">
            Bezoek Anemi Meets
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: data.to,
    subject: '📧 Verifieer je email - Welkom bij Anemi Meets!',
    html,
  });
}

/**
 * Send calendar invite email
 */
export async function sendCalendarInvite(data: CalendarInviteData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">📅 Agenda Uitnodiging</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Voeg deze koffie meetup toe aan je agenda</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé ${data.attendeeName}! ☕</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Perfect! Hier is je agenda uitnodiging voor de koffie meetup. 
          Voeg deze toe aan je agenda zodat je het niet vergeet!
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 Evenement Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>📅 Evenement:</strong> ${data.eventTitle}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📝 Beschrijving:</strong> ${data.eventDescription}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📍 Locatie:</strong> ${data.eventLocation}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>⏰ Start Tijd:</strong> ${data.eventStartTime}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>⏰ Eind Tijd:</strong> ${data.eventEndTime}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>👤 Aanwezige:</strong> ${data.attendeeName}</p>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Agenda Tips:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Stel een herinnering in voor 15 minuten voor aanvang</li>
            <li>Voeg de locatie toe aan je navigatie app</li>
            <li>Plan wat extra tijd voor reizen</li>
            <li>Deel je agenda met vrienden</li>
          </ul>
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
          We kijken uit naar je komst! ☕<br>
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
    to: data.to,
    subject: `📅 Agenda Uitnodiging: ${data.eventTitle}`,
    html,
  });
} 

/**
 * Send meetup decline notification email to organizer
 */
export async function sendMeetupDeclineNotification(
  organizerEmail: string,
  organizerName: string,
  inviteeName: string,
  inviteeEmail: string,
  meetupTitle: string,
  cafeName: string,
  reason?: string
) {
  console.log('📧 sendMeetupDeclineNotification called with:', { 
    organizerEmail, organizerName, inviteeName, inviteeEmail, meetupTitle, cafeName, reason 
  })
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Meetup Update</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Iemand heeft je uitnodiging afgewezen</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hé ${organizerName}! ☕</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          We willen je laten weten dat <strong>${inviteeName}</strong> heeft afgewezen voor je koffie meetup. 
          Dit is normaal en gebeurt vaak - niet iedereen kan altijd meedoen!
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 Afwijzing Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>👤 Afgewezen door:</strong> ${inviteeName}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📧 Email:</strong> ${inviteeEmail}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>☕ Meetup:</strong> ${meetupTitle}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>📍 Locatie:</strong> ${cafeName}</p>
          ${reason ? `<p style="margin: 8px 0; color: #92400e;"><strong>📝 Reden:</strong> ${reason}</p>` : ''}
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Wat kun je nu doen:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Nodig andere vrienden uit voor je meetup</li>
            <li>Bekijk wie nog wel kan komen</li>
            <li>Plan een nieuwe meetup voor een andere datum</li>
            <li>Blijf positief - er zijn altijd mensen die wel kunnen!</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
            📊 Bekijk Meetup Details
          </a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Blijf je meetups organiseren! ☕<br>
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
    to: organizerEmail,
    subject: `☕ ${inviteeName} heeft je meetup afgewezen`,
    html,
  });
}