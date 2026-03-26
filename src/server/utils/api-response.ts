import { NextResponse } from 'next/server'

export function okJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorJson(message: string, status = 400) {
  return NextResponse.json({ message }, { status })
}
