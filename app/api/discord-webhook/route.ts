import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get Discord webhook URL from environment variable
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Discord webhook URL not configured' },
        { status: 500 }
      )
    }

    // Format the message for Discord
    const discordMessage = {
      content: body.content || null,
      embeds: body.embeds || [
        {
          title: body.title || 'Log Entry',
          description: body.description || JSON.stringify(body, null, 2),
          color: body.color || 3447003, // Blue color by default
          timestamp: new Date().toISOString(),
          fields: body.fields || []
        }
      ]
    }

    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Discord webhook error:', errorText)
      return NextResponse.json(
        { error: 'Failed to send to Discord webhook', details: errorText },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Discord webhook API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
