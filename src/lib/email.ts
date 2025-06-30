import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  token: string;
  organizerName: string;
}

/**
 * Send a generic email using Resend
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
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

  return sendEmail({
    to,
    subject: `☕ Cancelled: ${meetupTitle}`,
    html,
  });
}

/**
 * Send invite email for Tiny-MVP
 */
export async function sendInviteEmail(data: InviteEmailData) {
  const inviteUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/invite/${data.token}`;
  
  const datesList = data.dates.map(date => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }).join(', ');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">☕ Coffee Meetup Invite</h2>
      
      <p>Hi there!</p>
      
      <p><strong>${data.organizerName}</strong> invited you for coffee at this great spot:</p>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #92400e;">${data.cafe.name}</h3>
        <p style="margin: 5px 0;"><strong>📍 Address:</strong> ${data.cafe.address}</p>
        <p style="margin: 5px 0;"><strong>⏰ Hours:</strong> ${data.cafe.openHours}</p>
        <p style="margin: 5px 0;"><strong>⭐ Rating:</strong> ${data.cafe.rating}/5</p>
        <p style="margin: 5px 0;"><strong>💰 Price:</strong> ${data.cafe.priceRange === 'cheap' ? '$' : data.cafe.priceRange === 'normal' ? '$$' : '$$$'}</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0369a1;">Available Dates:</h4>
        <p style="margin: 0;">${datesList}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" 
           style="background-color: #f59e0b; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Choose Date & Confirm
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        This invite expires in 7 days. Looking forward to seeing you there!<br>
        ☕ Anemi Meets
      </p>
    </div>
  `;

  return sendEmail({
    to: data.to,
    subject: `☕ Coffee at ${data.cafe.name}?`,
    html,
  });
} 