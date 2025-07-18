/**
 * Helper function to send meetup confirmation emails when both people accept
 */
export async function sendMeetupConfirmationEmails(
  meetupData: {
    title: string;
    date: string;
    time: string;
    location: string;
    cafeName: string;
    cafeAddress: string;
  },
  personA: {
    name: string;
    email: string;
  },
  personB: {
    name: string;
    email: string;
  }
) {
  try {
    const response = await fetch('/api/meetups/confirm-meetup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meetupData,
        personA,
        personB,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to send meetup confirmation emails')
    }

    const result = await response.json()
    console.log('Meetup confirmation emails sent:', result.message)
    return result
  } catch (error) {
    console.error('Error sending meetup confirmation emails:', error)
    throw error
  }
}

/**
 * Example usage in your meetup acceptance flow:
 * 
 * // When both people have accepted the meetup
 * await sendMeetupConfirmationEmails(
 *   {
 *     title: "Coffee Chat",
 *     date: "2024-01-15",
 *     time: "14:00",
 *     location: "Rotterdam",
 *     cafeName: "Coffee Corner",
 *     cafeAddress: "123 Coffee Street, Rotterdam"
 *   },
 *   {
 *     name: "Alice",
 *     email: "alice@example.com"
 *   },
 *   {
 *     name: "Bob", 
 *     email: "bob@example.com"
 *   }
 * )
 */ 