
export interface DiscordLogOptions {
  title?: string
  description?: string
  content?: string
  color?: number
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
}

/**
 * Send a log message to Discord webhook
 */
export async function logToDiscord(options: DiscordLogOptions): Promise<boolean> {
  try {
    const response = await fetch('/api/discord-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Failed to log to Discord:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error logging to Discord:', error)
    return false
  }
}
