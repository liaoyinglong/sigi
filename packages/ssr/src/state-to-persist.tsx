import { GLOBAL_KEY_SYMBOL } from '@sigi/core'
import React from 'react'
import serialize from 'serialize-javascript'

const ScriptId = 'sigi-persisted-data'

export class StateToPersist<T> {
  constructor(private readonly dataToPersist: T) {}

  extractToScriptString(withScriptTag = true) {
    if (this.dataToPersist == null) {
      return ''
    }
    const contentScript = this.serialize()
    return withScriptTag ? `<script id="${ScriptId}">${contentScript}</script>` : contentScript
  }

  renderToJSX() {
    if (this.dataToPersist == null) {
      return null
    }
    return <script id={ScriptId} dangerouslySetInnerHTML={{ __html: this.serialize() }} />
  }

  renderToDocument(doc: string) {
    if (this.dataToPersist == null) {
      return doc
    }
    const endBodyPosition = doc.indexOf('</body>')
    if (endBodyPosition === -1) {
      return doc
    }
    return doc.substr(0, endBodyPosition) + this.extractToScriptString() + doc.substring(endBodyPosition)
  }

  private serialize() {
    const content = serialize(this.dataToPersist, { isJSON: true })
    return `window['${GLOBAL_KEY_SYMBOL}']=${content}`
  }
}
