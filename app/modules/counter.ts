
import { signal } from "@preact/signals-react"


export const counter = signal(0)

export const increaseCounter = () => { counter.value++ }
export const decreaseCounter = () => { counter.value > 0 ? counter.value-- : null }
