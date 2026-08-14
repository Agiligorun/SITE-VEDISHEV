import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      name?: string
      phone?: string
      email?: string
      messenger?: string
      message?: string
      sourcePage?: string
    }

    if (!body?.name?.trim() || !body?.phone?.trim()) {
      return Response.json({ error: 'Имя и телефон обязательны.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'consultation-requests',
      overrideAccess: true,
      data: {
        name: body.name.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim() || undefined,
        messenger: body.messenger?.trim() || undefined,
        message: body.message?.trim() || undefined,
        sourcePage: body.sourcePage?.trim() || undefined,
        status: 'new',
      },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Не удалось сохранить заявку.' }, { status: 500 })
  }
}
