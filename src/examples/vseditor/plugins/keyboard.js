import keyboardJS from 'keyboardjs'
import {
  EVENT_APPLICATION_CLEAR,
  EVENT_APPLICATION_REDO,
  EVENT_APPLICATION_UNDO,
  EVENT_COMPONENT_DELETE,
  EVENT_COMPONENT_DUPLICATE,
} from '../event-enums'
const keyboardActions = [
  { action: EVENT_COMPONENT_DELETE, keys: 'backspace' },
  { action: EVENT_APPLICATION_UNDO, keys: 'command + z' },
  { action: EVENT_APPLICATION_REDO, keys: 'command + shift > z' },
  { action: EVENT_APPLICATION_CLEAR, keys: 'command + k' },
  { action: EVENT_COMPONENT_DUPLICATE, keys: 'command + d' },
]

export const registerKeyboardAction = (application) => {
  keyboardActions.forEach((item) => {
    keyboardJS.bind(item.keys, (e) => {
      // 忽略输入框
      if (!['input', 'textarea'].includes(e.target.tagName.toLowerCase())) {
        e.preventDefault()
        application.eventbus.$emit(item.action)
      }
    })
  })
}
