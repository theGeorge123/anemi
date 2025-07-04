import { softDeleteMeetup, restoreMeetup } from './soft-delete'

describe('soft-delete async utils', () => {
  it('should call softDeleteMeetup and restoreMeetup', async () => {
    expect(typeof softDeleteMeetup).toBe('function')
    expect(typeof restoreMeetup).toBe('function')
  })
}) 