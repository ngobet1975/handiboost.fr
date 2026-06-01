import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
  res.cookies.delete('admin_session')
  res.cookies.delete('pro_session')

  revalidatePath('/', 'layout')
  return res
}
