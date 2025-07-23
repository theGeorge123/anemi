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
      console.error('Email send error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
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
    eventDescription: `Coffee meetup at ${emailData.cafeName} with ${emailData.otherParticipantName}`,
    eventLocation: `${emailData.cafeName}, ${emailData.cafeAddress}`,
    eventStartTime: eventStartTime.toISOString(),
    eventEndTime: eventEndTime.toISOString(),
    attendeeName: emailData.participantName
  }

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Meetup Confirmed!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Your coffee adventure is officially scheduled</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hey ${emailData.participantName}! 👋</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Great news! Your coffee meetup with <strong>${emailData.otherParticipantName}</strong> has been confirmed. 
          Here are all the details you need:
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📅 Meetup Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>Event:</strong> ${emailData.meetupTitle}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Date:</strong> ${emailData.meetupDate}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Time:</strong> ${emailData.meetupTime}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Cafe:</strong> ${emailData.cafeName}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Address:</strong> ${emailData.cafeAddress}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Meeting:</strong> ${emailData.otherParticipantName} (${emailData.otherParticipantEmail})</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0D%0AVERSION:2.0%0D%0ABEGIN:VEVENT%0D%0ADTSTART:${eventStartTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z%0D%0ADTEND:${eventEndTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z%0D%0ASUMMARY:${encodeURIComponent(calendarData.eventTitle)}%0D%0ADESCRIPTION:${encodeURIComponent(calendarData.eventDescription)}%0D%0ALOCATION:${encodeURIComponent(calendarData.eventLocation)}%0D%0AEND:VEVENT%0D%0AEND:VCALENDAR" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;"
             download="coffee-meetup.ics">
            📅 Add to Calendar
          </a>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Pro Tips:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Arrive a few minutes early to find a good spot</li>
            <li>Bring cash in case the cafe doesn't accept cards</li>
            <li>Don't forget to exchange contact info if you haven't already</li>
            <li>Share photos of your meetup with the community!</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" 
             style="background-color: #10b981; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            📱 View in App
          </a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Have a great coffee meetup! ☕<br>
          <strong>The Anemi Meets Team</strong>
        </p>
        <div style="margin-top: 15px;">
          <a href="${siteUrl}" 
             style="color: #f59e0b; text-decoration: none; font-size: 14px;">
            Visit Anemi Meets
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: emailData.to,
    subject: `☕ Confirmed: ${emailData.meetupTitle} - ${emailData.meetupDate} at ${emailData.meetupTime}`,
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
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Meetup Accepted!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Your coffee meetup is now confirmed</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Great news! 🎉</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Your coffee meetup has been accepted! Now it's time to coordinate the details.
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 Meetup Details</h3>
          <p style="margin: 8px 0; color: #92400e;"><strong>Organizer:</strong> ${data.organizerName}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Invitee:</strong> ${data.inviteeName}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Cafe:</strong> ${data.cafe.name}</p>
          <p style="margin: 8px 0; color: #92400e;"><strong>Address:</strong> ${data.cafe.address}</p>
          ${data.cafe.description ? `<p style="margin: 8px 0; color: #92400e;"><strong>Description:</strong> ${data.cafe.description}</p>` : ''}
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">📅 Meetup Details</h3>
          ${data.chosenDate && data.chosenTime ? `
            <div style="background-color: #dcfce7; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #16a34a;">
              <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">✅ Confirmed Date & Time</h4>
              <p style="color: #166534; margin: 5px 0;"><strong>Date:</strong> ${new Date(data.chosenDate).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="color: #166534; margin: 5px 0;"><strong>Time:</strong> ${data.chosenTime}</p>
            </div>
          ` : `
            <p style="color: #0c4a6e; margin: 8px 0;"><strong>Available Dates:</strong> ${data.availableDates.map(date => new Date(date).toLocaleDateString('nl-NL')).join(', ')}</p>
            <p style="color: #0c4a6e; margin: 8px 0;"><strong>Available Times:</strong> ${data.availableTimes.join(', ')}</p>
          `}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
            📱 View in App
          </a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Have a great coffee meetup! ☕<br>
          <strong>The Anemi Meets Team</strong>
        </p>
        <div style="margin-top: 15px;">
          <a href="${siteUrl}" 
             style="color: #f59e0b; text-decoration: none; font-size: 14px;">
            Visit Anemi Meets
          </a>
        </div>
      </div>
    </div>
  `;

  // Send email to organizer
  await sendEmail({
    to: data.organizerEmail,
    subject: `☕ Meetup Accepted: ${data.inviteeName} has joined your coffee meetup!`,
    html,
  });

  // Send email to invitee
  await sendEmail({
    to: data.inviteeEmail,
    subject: `☕ Meetup Accepted: You've joined ${data.organizerName}'s coffee meetup!`,
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
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎉 Welcome to Anemi Meets!</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Your coffee adventure is officially underway</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #ffffff;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hey ${emailData.userName}! 👋</h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Congratulations! Your email has been verified and you're now part of the Anemi Meets community. 
          Get ready to discover amazing coffee shops and connect with fellow coffee enthusiasts!
        </p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🚀 What you can do now:</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Explore local coffee shops with ratings and reviews ☕</li>
            <li>Join meetups or create your own coffee adventures 👥</li>
            <li>Connect with coffee lovers in your area 💫</li>
            <li>Get personalized coffee recommendations 🗺️</li>
            <li>Share your coffee discoveries with the community 📸</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/explore" 
             style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                    box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
            🗺️ Start Exploring
          </a>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">💡 Pro Tips:</h3>
          <ul style="color: #0c4a6e; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Complete your profile to get better recommendations</li>
            <li>Follow coffee shops you love to stay updated</li>
            <li>Join our community discussions about coffee</li>
            <li>Share your favorite coffee spots with friends</li>
          </ul>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Ready to start your coffee journey?<br>
          <strong>The Anemi Meets Team</strong>
        </p>
        <div style="margin-top: 15px;">
          <a href="${siteUrl}" 
             style="color: #f59e0b; text-decoration: none; font-size: 14px;">
            Visit Anemi Meets
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: emailData.to,
    subject: '🎉 Welcome to Anemi Meets! Your coffee adventure begins now',
    html,
  });
}

/**
 * Send meetup invitation email
 */
export async function sendMeetupInvitation(emailData: MeetupInvitationEmail) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">☕ You're invited to a coffee meetup!</h2>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${emailData.meetupTitle}</h3>
        <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${emailData.meetupDate}</p>
        <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${emailData.meetupLocation}</p>
        <p style="margin: 5px 0;"><strong>👤 Organizer:</strong> ${emailData.organizerName}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${emailData.invitationLink}" 
           style="background-color: #f59e0b; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Join Meetup
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        This invitation was sent from Anemi Meets. 
        Connect with coffee lovers in your community!
      </p>
    </div>
  `;

  return sendEmail({
    to: emailData.to,
    subject: `☕ You're invited: ${emailData.meetupTitle}`,
    html,
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(emailData: WelcomeEmail) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">☕ Welcome to Anemi Meets!</h2>
      
      <p>Hi ${emailData.userName},</p>
      
      <p>Welcome to Anemi Meets! We're excited to help you discover amazing coffee shops 
      and connect with like-minded people in your community.</p>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0;">What you can do:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Discover local coffee shops with ratings and reviews</li>
          <li>Join meetups or create your own</li>
          <li>Connect with coffee enthusiasts in your area</li>
          <li>Get personalized coffee recommendations</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL}/explore" 
           style="background-color: #f59e0b; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Start Exploring
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Happy coffee adventures!<br>
        The Anemi Meets Team
      </p>
    </div>
  `;

  return sendEmail({
    to: emailData.to,
    subject: '☕ Welcome to Anemi Meets!',
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
      <h2 style="color: #f59e0b;">☕ Meetup Reminder</h2>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${meetupTitle}</h3>
        <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${meetupDate}</p>
        <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${meetupLocation}</p>
      </div>
      
      <p>Don't forget about your upcoming coffee meetup! We're looking forward to seeing you there.</p>
      
      <p style="color: #6b7280; font-size: 14px;">
        This reminder was sent from Anemi Meets.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `☕ Reminder: ${meetupTitle}`,
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
      <h2 style="color: #ef4444;">☕ Meetup Cancelled</h2>
      
      <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${meetupTitle}</h3>
        <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${meetupDate}</p>
        ${reason ? `<p style="margin: 5px 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>
      
      <p>Unfortunately, this meetup has been cancelled. We'll notify you of any rescheduled events.</p>
      
      <p style="color: #6b7280; font-size: 14px;">
        This notification was sent from Anemi Meets.
      </p>
    </div>
  `;

  try {
    const result = await sendEmail({
      to,
      subject: `☕ Cancelled: ${meetupTitle}`,
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
      <h2 style="color: #f59e0b;">☕ Coffee Meetup Invite</h2>
      
      <p>Hi there!</p>
      
      <p>You've been invited to join a coffee meetup at <strong>${data.cafe.name}</strong>!</p>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px 0;">Meetup Details</h3>
        <p style="margin: 5px 0;"><strong>📍 Cafe:</strong> ${data.cafe.name}</p>
        <p style="margin: 5px 0;"><strong>🏠 Address:</strong> ${data.cafe.address}</p>
        <p style="margin: 5px 0;"><strong>💰 Price Range:</strong> ${data.cafe.priceRange}</p>
        <p style="margin: 5px 0;"><strong>⭐ Rating:</strong> ${data.cafe.rating}/5</p>
        <p style="margin: 5px 0;"><strong>🕒 Hours:</strong> ${data.cafe.openHours}</p>
        <p style="margin: 5px 0;"><strong>📅 Dates:</strong> ${datesList}</p>
        ${data.times ? `<p style="margin: 5px 0;"><strong>⏰ Times:</strong> ${data.times.join(', ')}</p>` : ''}
        <p style="margin: 5px 0;"><strong>👤 Organizer:</strong> ${data.organizerName}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.inviteLink || '#'}" 
           style="background-color: #f59e0b; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Join Meetup
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        This invitation was sent from Anemi Meets. 
        Connect with coffee lovers in your community!
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
    subject: `☕ You're invited: Coffee meetup at ${data.cafe.name}`,
    html: generateInviteEmailHTML(data),
  });
}

/**
 * Send calendar invite email
 */
export async function sendCalendarInvite(data: CalendarInviteData) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">📅 Calendar Invite</h2>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">${data.eventTitle}</h3>
        <p style="margin: 5px 0;"><strong>📝 Description:</strong> ${data.eventDescription}</p>
        <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${data.eventLocation}</p>
        <p style="margin: 5px 0;"><strong>⏰ Start Time:</strong> ${data.eventStartTime}</p>
        <p style="margin: 5px 0;"><strong>⏰ End Time:</strong> ${data.eventEndTime}</p>
        <p style="margin: 5px 0;"><strong>👤 Attendee:</strong> ${data.attendeeName}</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        This calendar invite was sent from Anemi Meets.
      </p>
    </div>
  `;

  return sendEmail({
    to: data.to,
    subject: `📅 Calendar Invite: ${data.eventTitle}`,
    html,
  });
} 