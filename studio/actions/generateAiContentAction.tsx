'use client'

import React from 'react'
import type { DocumentActionComponent } from 'sanity'

const API_ENDPOINT = '/api/enrich-product'

export const GenerateAiContentAction: DocumentActionComponent = (props) => {
  const [isRunning, setIsRunning] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  if (props.type !== 'product') {
    return null
  }

  return {
    label: isRunning ? 'Generating…' : 'Generate AI content',
    tone: errorMessage ? 'critical' : 'primary',
    disabled: isRunning,
    onHandle: async () => {
      setIsRunning(true)
      setErrorMessage(null)

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documentId: props.id }),
        })

        const payload = await response.json().catch(() => ({}))

        if (!response.ok || payload?.ok !== true) {
          const message = payload?.error || `Request failed with status ${response.status}`
          throw new Error(message)
        }

        props.onComplete()
      } catch (error) {
        console.error('Generate AI content failed', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        setErrorMessage(message)
        props.onComplete()
      } finally {
        setIsRunning(false)
      }
    },
    dialog: errorMessage
      ? {
          type: 'dialog',
          title: 'Generate AI content failed',
          content: (
            <div style={{ padding: '1rem' }}>
              <p>{errorMessage}</p>
            </div>
          ),
          onClose: () => setErrorMessage(null),
        }
      : undefined,
  }
}

